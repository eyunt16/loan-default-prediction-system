import React, { useState, useContext, useEffect } from "react";
import {
  Layout,
  Typography,
  Steps,
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  message,
  Space,
} from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  BankOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { LoanContext } from "../../contexts/LoanContext";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const LoanForm = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const { addRecord } = useContext(LoanContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [manualToggle, setManualToggle] = useState(false);

  useEffect(() => {
    if (manualToggle) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);

    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [manualToggle]);

  const steps = [
    {
      title: "Personal Info",
      icon: <UserOutlined />,
      fields: ["fullName", "age", "email"],
      content: (
        <>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input placeholder="Ex: John Doe" size="large" />
          </Form.Item>

          <Form.Item
            name="age"
            label="Age"
            rules={[
              { required: true },
              { type: "number", min: 18, message: "Must be 18+" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input placeholder="example@email.com" size="large" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Financial Info",
      icon: <BankOutlined />,
      fields: ["income", "loanAmount", "creditScore"],
      content: (
        <>
          {/* 1. Monthly Income */}
          <Form.Item
            name="income"
            label="Monthly Income"
            rules={[{ required: true, message: "Please enter your income!" }]}
          >
            <Space.Compact style={{ width: "100%", display: "flex" }}>
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Ex: 10,000,000"
              />
              <Button
                style={{
                  width: "60px",
                  cursor: "default",
                  color: "rgba(0,0,0,0.45)",
                }}
                disabled
              >
                VND
              </Button>
            </Space.Compact>
          </Form.Item>

          {/* 2. Loan Amount */}
          <Form.Item
            name="loanAmount"
            label="Loan Amount"
            rules={[{ required: true, message: "Please enter loan amount!" }]}
          >
            <Space.Compact style={{ width: "100%", display: "flex" }}>
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Ex: 50,000,000"
              />
              <Button
                style={{
                  width: "60px",
                  cursor: "default",
                  color: "rgba(0,0,0,0.45)",
                }}
                disabled
              >
                VND
              </Button>
            </Space.Compact>
          </Form.Item>

          {/* 3. Credit Score */}
          <Form.Item
            name="creditScore"
            label="Credit Score"
            rules={[{ required: true, message: "Please enter credit score!" }]}
          >
            <InputNumber
              min={300}
              max={850}
              style={{ width: "100%" }}
              size="large"
              placeholder="300 - 850"
            />
          </Form.Item>
        </>
      ),
    },

    {
      title: "Confirmation",
      icon: <SolutionOutlined />,
      fields: [],
      content: (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <SmileOutlined style={{ fontSize: "60px", color: "#52c41a" }} />
          <Title level={3} style={{ marginTop: 20 }}>
            Ready to Submit?
          </Title>
          <p>We will process your application using AI immediately.</p>
        </div>
      ),
    },
  ];

  const next = () => {
    const currentFields = steps[current].fields;
    form
      .validateFields(currentFields)
      .then(() => setCurrent(current + 1))
      .catch(() => {});
  };

  const prev = () => setCurrent(current - 1);

  const onFinish = (values) => {
    addRecord(values);
    message.success("Application submitted successfully!");
    setTimeout(() => navigate("/admin"), 1000);
  };

  return (
    <Layout
      className={darkMode ? "dark" : ""}
      style={{
        minHeight: "100vh",
        background: darkMode
          ? undefined
          : "linear-gradient(120deg, #d3d5da 0%, #8fd3f4 100%)",
      }}
    >
      {/*CSS BUTTON CUSTOM */}
      <style>{`
  /* ======================================================
   BASE BUTTON – STYLE CHUNG
====================================================== */
.btn {
  height: 46px;
  padding: 0 36px;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: none;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-position 0.6s ease;
}

/* ======================================================
   NEXT BUTTON – LIGHT MODE
====================================================== */
.btn-gradient {
  background-image: linear-gradient(
    135deg,
    #7dd3fc 0%,
    #38bdf8 50%,
    #0ea5e9 100%
  );
  background-size: 200% 200%;
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(14, 165, 233, 0.35);
}

.btn-gradient:hover {
  background-position: 100% 50%;
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(14, 165, 233, 0.5);
}

.btn-gradient:active {
  transform: scale(0.96);
}

/* ======================================================
   SUBMIT BUTTON – LIGHT MODE
====================================================== */
.btn-submit {
  background-image: linear-gradient(
    135deg,
    #fb7185 0%,
    #f43f5e 50%,
    #e11d48 100%
  );
  background-size: 200% 200%;
  color: #ffffff;
  box-shadow: 0 10px 26px rgba(225, 29, 72, 0.45);
}

/* ======================================================
   PREVIOUS BUTTON – GHOST
====================================================== */
.btn-ghost {
  background: transparent !important;
  border: 2px solid #e5e7eb !important;
  color: #475569 !important;
}

.btn-ghost:hover {
  border-color: #38bdf8 !important;
  color: #38bdf8 !important;
  transform: translateX(-6px);
  box-shadow: 0 6px 16px rgba(56, 189, 248, 0.25);
}

/* REMOVE DEFAULT ANTD PRIMARY */
.ant-btn-primary {
  background: none !important;
  box-shadow: none !important;
}

/* ======================================================
   DARK MODE – BACKGROUND
====================================================== */
.dark {
  background: linear-gradient(
    120deg,
    #2d4f63 0%,
    #3a507a 60%,
    #0f172a 100%
  ) !important;
}

/* ======================================================
   DARK MODE – CARD
====================================================== */
.dark .ant-card {
  background: rgba(15, 23, 42, 0.9) !important;
  color: #e5e7eb;
  border: 1px solid #1e293b;
  border-radius: 20px;
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

/* ======================================================
   DARK MODE – TEXT
====================================================== */
.dark h1,
.dark h2,
.dark h3,
.dark h4 {
  color: #f1f5f9 !important;
}

.dark p,
.dark label {
  color: #cbd5f5 !important;
}

/* ======================================================
   DARK MODE – INPUT (TEXT + NUMBER)
====================================================== */
.dark .ant-input,
.dark .ant-input-affix-wrapper {
  background: #0f172a !important;
  border-color: #334155 !important;
  color: #e5e7eb !important;
}

.dark .ant-input-number {
  background: #0f172a !important;
  border-color: #334155 !important;
  color: #e5e7eb !important;
}

.dark .ant-input-number-input-wrap {
  background: transparent !important;
}
.dark .ant-input-number-input {
  background: transparent !important;
  color: #e5e7eb !important;
  font-weight: 500;
}

/* ======================================================
   DARK MODE – ADDON (VND)
====================================================== */
.dark .ant-input-number-group-addon {
  background: #020617 !important;
  border-color: #334155 !important;
  color: #7dd3fc !important;
  font-weight: 600;
}

/* ======================================================
   DARK MODE – FOCUS STATE
====================================================== */
.dark .ant-input:focus,
.dark .ant-input-affix-wrapper-focused {
  background: #020617 !important;
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
}

.dark .ant-input-number-focused {
  background: #020617 !important;
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
}

.dark
.ant-input-number-focused
.ant-input-number-group-addon {
  border-color: #38bdf8 !important;
  color: #bae6fd !important;
}

/* ======================================================
   DARK MODE – STEPS
====================================================== */
.dark .ant-steps-item-title,
.dark .ant-steps-item-description {
  color: #cbd5f5 !important;
}

.dark .ant-steps-item-process .ant-steps-item-icon {
  background: #4ef3fc !important;
  border-color: #38bdf8 !important;
  color: #020617;
}

/* ======================================================
   DARK MODE – BUTTONS
====================================================== */
.dark .btn-gradient {
  box-shadow: 0 14px 36px rgba(56, 189, 248, 0.55);
}

.dark .btn-submit {
  background-image: linear-gradient(
    135deg,
    #dc2626 0%,
    #f43f5e 50%,
    #fb7185 100%
  );
  box-shadow: 0 16px 40px rgba(244, 63, 94, 0.6);
}

.dark .btn-ghost {
  border-color: #334155 !important;
  color: #94a3b8 !important;
}

.dark .btn-ghost:hover {
  border-color: #38bdf8 !important;
  color: #38bdf8 !important;
}

/* ================= LIGHT MODE ================= */
.theme-switch {
  width: 64px;
  height: 32px;

  /* 🌤 nền light */
  background: linear-gradient(135deg, #fdebd3, #f7e7db);

  border-radius: 999px;
  position: relative;
  cursor: pointer;

  /* viền nhẹ cho khung */
  border: 1px solid #f1d7c3;

  transition: all 0.35s ease;
  box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.7),
              0 4px 12px rgba(0, 0, 0, 0.08);
}

.theme-switch::before {
  content: "🌞";
  position: absolute;
  top: 3px;
  left: 4px;

  width: 26px;
  height: 26px;

  background: linear-gradient(135deg, #e6fbff, #c6eff2);
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.35s ease;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

/* ================= DARK MODE ================= */
.theme-switch.dark {
  /* 🌙 nền dark cho khung oval */
  background: linear-gradient(
    135deg,
    #41495d,
    #365d9c
  );

  /* viền khung dark */
  border: 1px solid #334155;

  /* tạo chiều sâu */
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.65),
              0 6px 18px rgba(15, 23, 42, 0.8);
}

/* Nút tròn khi dark */
.theme-switch.dark::before {
  content: "🌙";

  /* đẩy sang phải */
  transform: translateX(32px);

  /* màu nút dark */
  background: linear-gradient(
    135deg,
    #1e40af,
    #38bdf8
  );

  color: #020617;

  box-shadow: 0 6px 14px rgba(56, 189, 248, 0.45);
}
  


`}</style>

      <Header
        style={{
          background: "transparent",
          fontSize: 22,
          fontWeight: 900,
          padding: "0 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        🏦 Loan Approval System
        <div
          className={`theme-switch ${darkMode ? "dark" : ""}`}
          onClick={() => {
            setDarkMode(!darkMode);
            setManualToggle(true);
          }}
        />
      </Header>

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 600,
            minHeight: 800,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(70, 49, 154, 0.37)",
          }}
        >
          <Steps
            current={current}
            items={steps.map((s) => ({
              key: s.title,
              title: s.title,
              icon: s.icon,
            }))}
            style={{ marginBottom: 40 }}
          />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {steps.map((step, index) => (
              <div
                key={step.title}
                style={{
                  display: index === current ? "block" : "none",
                  maxWidth: 500,
                  margin: "0 auto",
                }}
              >
                {step.content}
              </div>
            ))}

            <div style={{ marginTop: 40, textAlign: "center" }}>
              {current > 0 && (
                <Button className="btn btn-ghost" onClick={prev}>
                  Previous
                </Button>
              )}

              {current < steps.length - 1 && (
                <Button className="btn btn-gradient" onClick={next}>
                  Next Step
                </Button>
              )}

              {current === steps.length - 1 && (
                <Button
                  className="btn btn-gradient btn-submit"
                  htmlType="submit"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </Content>

      <Footer
        style={{
          background: "transparent",
          fontWeight: 600,
          fontSize: 14,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <strong>Loan System ©2026 Created by My Tuyen</strong>
      </Footer>
    </Layout>
  );
};

export default LoanForm;
