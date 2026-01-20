# 🚀 Scalable Loan Default Prediction System

## 📑 Project Presentation & Report

- **📂 Final Report:** [Click to view PDF](./docs/Report_ScalableandDistributedComputing.pdf)
- **📊 Presentation Slides:** [Click here to view on Canva](https://www.canva.com/design/DAG-4c6iZh0/IDOeT5-IzSIquWwjS0IDuA/edit?utm_content=DAG-4c6iZh0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

![Status](https://img.shields.io/badge/Status-Finished-success?style=flat-square)
![Spark](https://img.shields.io/badge/Big_Data-Apache_Spark-E25A1C?style=flat-square&logo=apachespark&logoColor=white)
![Python](https://img.shields.io/badge/Backend-Flask_Python-3776AB?style=flat-square&logo=python&logoColor=white)
![React](https://img.shields.io/badge/Frontend-ReactJS-61DAFB?style=flat-square&logo=react&logoColor=black)

> **Final Project / Capstone Project**
> A Full-stack Big Data Application that utilizes **Apache Spark** for decision-tree based credit scoring, served via a **Flask API** and visualized on a **React Dashboard**.

---

## 📖 Table of Contents

- [Architecture & Features](#-architecture--features)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
- [Running the System](#-running-the-system)
- [🧪 How to Test (Sample Data)](#-how-to-test-sample-data)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Architecture & Features

This system implements a **Hybrid Risk Engine** to process loan applications with high performance (< 200ms latency):

1.  **Layer 1 - Hard Rules (Filter):** Instantly rejects applications with `CIC Score < 455` or `Loan > 15x Income`.
2.  **Layer 2 - VIP Rules (Fast-track):** Instantly approves `CIC Score > 750`.
3.  **Layer 3 - AI Model (Spark):** Uses a **Decision Tree Classifier** for complex cases.

**Tech Stack:**

- **Core:** Apache Spark (PySpark MLlib)
- **Backend:** Python Flask, Numpy
- **Frontend:** ReactJS, Ant Design, Recharts, Axios

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **Java Development Kit (JDK 8 or 11)** - _CRITICAL for Spark_
    - Verify by running: `java -version`
2.  **Python 3.8+**
    - Verify by running: `python --version`
3.  **Node.js (v14+) & npm**
    - Verify by running: `node -v`

---

## 🛠️ Installation Guide

### 1. Clone the Project

```bash

git clone https://github.com/eyunt16/loan-prediction-system.git

cd loan-prediction-system

```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install pyspark flask flask-cors numpy
```

---

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
```

---

## 🚀 Running the System

To run the application locally, you need to open **two separate terminal windows**: one for the Backend and one for the Frontend.

### Step 1: Train the AI Model (Critical First Step)

Before starting the server, you must train the Spark model so it can be saved to the disk.

1. Open a terminal and navigate to the `backend` folder.
2. Run the training script:
   ```bash
   python train_model.py
   ```
3. **Wait** until you see the success message: `🎉 TRAINING SUCCESSFUL!`.
   _(This process generates a `loan_model` folder needed for the API)._

### Step 2: Start the Backend API

In the same terminal (inside `backend` folder), run:

```bash
python app.py
```

### Step 3: Start the Frontend Dashboard

1. Open a **new** terminal window (Keep the backend terminal running).
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Start the React application:

```bash
cd loan-dashboard
npm run dev

```

## The application will open automatically at: http://localhost:5173/

## 🧪 How to Test (Sample Data)

Once the system is running, use these values in the **Loan Application Form** to verify the Hybrid Risk Engine:

| Test Case          | Age | Income ($) | Loan Amount ($) | Credit Score | Expected Result | Reason                             |
| :----------------- | :-- | :--------- | :-------------- | :----------- | :-------------- | :--------------------------------- |
| **1. Hard Reject** | 25  | 5,000      | 2,000           | **400**      | ❌ Rejected     | **Layer 1:** Bad Debt (CIC < 455)  |
| **2. High Debt**   | 30  | 1,000      | 20,000          | 600          | ❌ Rejected     | **Layer 1:** Loan > 15x Income     |
| **3. VIP Approve** | 40  | 80,000     | 10,000          | **780**      | ✅ Approved     | **Layer 2:** VIP Customer          |
| **4. AI Approve**  | 35  | 60,000     | 5,000           | **650**      | ✅ Approved     | **Layer 3:** Safe (AI Prediction)  |
| **5. AI Reject**   | 22  | 15,000     | 12,000          | **500**      | ❌ Rejected     | **Layer 3:** Risky (AI Prediction) |

---

## 🔧 Troubleshooting

**Q: `Java not found` or `JAVA_HOME is not set`?**

> **A:** Apache Spark requires Java. Please install **JDK 8 or 11** and set the `JAVA_HOME` environment variable.

**Q: `pyspark.sql.utils.AnalysisException: Path does not exist`?**

> **A:** The model is missing. Stop the server and run `python train_model.py` again.

**Q: Frontend says "Network Error"?**

> **A:** Check if the Backend terminal is open and running on `http://127.0.0.1:5000`.

---

## 👨‍💻 Author

**Nguyen Thi My Tuyen**

- **Project:** Loan Default Prediction System
- **University:** International University

---
