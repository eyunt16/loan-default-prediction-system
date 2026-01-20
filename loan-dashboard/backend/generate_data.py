import csv
import random
import os

# Cấu hình: Số lượng hồ sơ muốn tạo (Ví dụ: 2000 hồ sơ)
NUM_RECORDS = 2000
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "data", "loans.csv")

# Đảm bảo thư mục data tồn tại
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

print(f"--- ĐANG SINH {NUM_RECORDS} DỮ LIỆU GIẢ LẬP... ---")

def generate_one_record():
    # 1. Tuổi: 18 đến 70
    age = random.randint(18, 70)
    
    # 2. Thu nhập: Tạo ra sự chênh lệch giàu nghèo
    # Phần lớn (70%) lương từ 5tr - 20tr
    # Phần nhỏ (20%) lương từ 20tr - 50tr
    # Phần hiếm (10%) lương > 50tr
    rand_income = random.random()
    if rand_income < 0.7:
        income = random.randint(5000000, 20000000)
    elif rand_income < 0.9:
        income = random.randint(20000000, 50000000)
    else:
        income = random.randint(50000000, 150000000)
        
    # 3. Điểm tín dụng: 300 - 850
    # Người thu nhập cao thường (nhưng không chắc chắn) có điểm tín dụng tốt hơn
    base_score = random.randint(300, 850)
    if income > 30000000:
        credit_score = min(850, base_score + 100) # Cộng điểm thưởng cho người giàu
    else:
        credit_score = base_score

    # 4. Số tiền vay: Thường người ta vay khoảng 3-20 lần thu nhập
    multiplier = random.uniform(1, 15) 
    loan_amount = int(income * multiplier)

    # 5. QUY LUẬT GÁN NHÃN (LABEL): 0 = Tốt, 1 = Xấu (Rủi ro)
    # Logic: Càng vay nhiều so với lương + Điểm tín dụng thấp => Rủi ro cao
    
    risk_points = 0
    
    # Luật 1: Điểm tín dụng thấp
    if credit_score < 450: risk_points += 4
    elif credit_score < 600: risk_points += 2
    
    # Luật 2: Vay quá nhiều so với thu nhập (Tỷ lệ nợ)
    debt_ratio = loan_amount / income
    if debt_ratio > 10: risk_points += 3 # Vay gấp 10 lần lương -> Rủi ro cao
    elif debt_ratio > 5: risk_points += 1
    
    # Luật 3: Tuổi quá trẻ hoặc quá già mà vay nhiều
    if (age < 22 or age > 60) and debt_ratio > 8:
        risk_points += 2

    # Chốt Label dựa trên điểm rủi ro
    # Có thêm chút ngẫu nhiên (random) để AI không học vẹt (Overfitting)
    if risk_points >= 4:
        # Rủi ro cao -> 90% là Xấu (1), 10% vẫn trả được (0)
        label = 1 if random.random() < 0.9 else 0
    elif risk_points >= 2:
        # Rủi ro vừa -> 40% là Xấu (1)
        label = 1 if random.random() < 0.4 else 0
    else:
        # Rủi ro thấp -> Chỉ 5% là Xấu (1) (xui rủi)
        label = 1 if random.random() < 0.05 else 0

    return [age, income, loan_amount, credit_score, label]

# Ghi ra file CSV
with open(OUTPUT_FILE, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # Header chuẩn
    writer.writerow(['age', 'income', 'loan_amount', 'credit_score', 'label'])
    
    # Data rows
    for _ in range(NUM_RECORDS):
        writer.writerow(generate_one_record())

print(f"✅ ĐÃ TẠO XONG: {OUTPUT_FILE}")
print("👉 Bây giờ bạn hãy chạy lại file train_model.py để AI học dữ liệu mới này!")