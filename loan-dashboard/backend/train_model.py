import os
from pyspark.sql import SparkSession
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.classification import DecisionTreeClassifier
from pyspark.ml import Pipeline
from pyspark.ml.evaluation import MulticlassClassificationEvaluator

# --- AUTOMATIC PATH CONFIGURATION ---
# Get the current directory of this file
current_dir = os.path.dirname(os.path.abspath(__file__))
# Path to CSV file
csv_path = os.path.join(current_dir, "data", "loans.csv")
# Path to save the trained model
model_path = os.path.join(current_dir, "loan_model")

print("===========================================")
print("      STARTING SPARK MODEL TRAINING        ")
print("===========================================")

# 1. Initialize Spark Session
spark = SparkSession.builder \
    .appName("LoanDefaultTraining") \
    .master("local[*]") \
    .config("spark.ui.showConsoleProgress", "false") \
    .getOrCreate()

print(f">>> Reading data from: {csv_path}")

# 2. Load Data
try:
    data = spark.read.csv(csv_path, header=True, inferSchema=True)
except Exception as e:
    print(f"ERROR: CSV file not found at {csv_path}")
    print("Please create 'data' folder and 'loans.csv' file first!")
    spark.stop()
    exit()

# 3. Feature Vectorization
assembler = VectorAssembler(
    inputCols=["age", "income", "loan_amount", "credit_score"],
    outputCol="features"
)

# 4. Split Train/Test Data (80/20)
trainData, testData = data.randomSplit([0.8, 0.2], seed=42)

# 5. Configure Algorithm (Decision Tree)
dt = DecisionTreeClassifier(labelCol="label", featuresCol="features", maxDepth=5)

# 6. Create Pipeline and Train
pipeline = Pipeline(stages=[assembler, dt])
print(">>> Training in progress...")
model = pipeline.fit(trainData)

# 7. Evaluate Accuracy
predictions = model.transform(testData)
evaluator = MulticlassClassificationEvaluator(
    labelCol="label", predictionCol="prediction", metricName="accuracy"
)
accuracy = evaluator.evaluate(predictions)
print(f"✅ MODEL ACCURACY: {accuracy * 100:.2f}%")

# 8. Save Model
print(f">>> Saving model to: {model_path}")
model.write().overwrite().save(model_path)

print("🎉 TRAINING SUCCESSFUL! YOU CAN RUN APP.PY NOW.")
spark.stop()