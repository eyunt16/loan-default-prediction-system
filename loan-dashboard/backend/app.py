import os
import sys

os.environ['PYSPARK_PYTHON'] = sys.executable
os.environ['PYSPARK_DRIVER_PYTHON'] = sys.executable

from flask import Flask, request, jsonify
from flask_cors import CORS
from pyspark.sql import SparkSession
from pyspark.ml import PipelineModel

app = Flask(__name__)
CORS(app)

print("===============================================")
print("--- LOAN PREDICTION SERVER IS RUNNING ---")
print("===============================================")

# 1. Init Spark
spark = SparkSession.builder \
    .appName("LoanPredictionAPI") \
    .master("local[*]") \
    .config("spark.ui.showConsoleProgress", "false") \
    .getOrCreate()

# 2. Load Model 
current_dir = os.path.dirname(os.path.abspath(__file__)) 
MODEL_PATH = os.path.join(current_dir, "loan_model")    
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = PipelineModel.load(MODEL_PATH)
        print(f"✅ MODEL LOADED SUCCESSFULLY FROM: {MODEL_PATH}")
    except Exception as e:
        print(f"❌ MODEL LOAD ERROR: {e}")
else:
    print(f"❌ MODEL NOT FOUND AT: {MODEL_PATH}")

def clean_currency(value):
    if not value:
        return 0.0
    str_val = str(value).replace(',', '').replace('.', '').replace(' VND', '')
    try:
        return float(str_val)
    except:
        return 0.0

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "message": "System Ready"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"status": "error", "message": "Model not loaded"}), 500
    try:
        data = request.json
        print(f"📥 New Request: {data.get('fullName')} - Score: {data.get('creditScore')}")

        age = int(data.get('age', 0))
        income = clean_currency(data.get('income', 0))       
        loan_amount = clean_currency(data.get('loanAmount', 0)) 
        credit_score = int(data.get('creditScore', 0))

        # --- 1. HARD RULES (REJECT) ---
        if credit_score < 455:
            return jsonify({"status": "rejected", "reason": "Bad Debt (CIC < 455)"})
        
        if income > 0 and (loan_amount / income) > 15:
             return jsonify({"status": "rejected", "reason": "Loan exceeds 15x Income"})

        # --- 2. VIP RULES (AUTO APPROVE) ---
        if credit_score >= 750:
            return jsonify({"status": "approved", "reason": "VIP Customer (Auto Approved)"})

        # --- 3. AI PREDICTION (SOFT RULES) ---
        df_input = spark.createDataFrame([{
            'age': age, 'income': income, 'loan_amount': loan_amount, 
            'credit_score': credit_score, 'label': 0 
        }])
        
        prediction = model.transform(df_input)
        result = prediction.select("prediction").collect()[0][0]
        
        if result == 1.0:
            return jsonify({"status": "rejected", "reason": "High Risk (AI Prediction)"})
        else:
            return jsonify({"status": "approved", "reason": "Low Risk / Safe (AI Approved)"})

    except Exception as e:
        print(f"❌ ERROR: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)