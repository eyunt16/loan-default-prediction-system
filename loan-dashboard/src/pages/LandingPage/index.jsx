import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  Card,
  Row,
  Col,
  Space,
  Statistic,
} from "antd";
import {
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
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

  return (
    <Layout
      className={darkMode ? "dark" : "light"}
      style={{ minHeight: "100vh", transition: "all 0.3s ease" }}
    >
      <style>{`
        .light { background: linear-gradient(120deg, #d3d5da 0%, #8fd3f4 100%); }
        .dark { background: linear-gradient(120deg, #8cb6c2 0%, #3a507a 60%, #0f172a 100%); }

        /*  2. MÀU CHỮ */ 
        .light h1, .light h2, .light h3, .light h4, .light span { color: #212123 !important; }
        .light p { color: #12171d !important; }
        .dark h1, .dark h2, .dark h3, .dark h4, .dark span { color: #f1f5f9 !important; }
        .dark p { color: #cbd5f5 !important; }

        /* 3. THẺ KÍNH  */
        .glass-card {
            border-radius: 24px;
            transition: all 0.3s ease;
            height: 100%;
            border: 1px solid rgba(255, 255, 255, 0.7);
            cursor: default; 
        }
        
        .light .glass-card {
            background: rgba(250, 250, 250, 0.65);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
        }
        
        .dark .glass-card {
            background: rgba(86, 99, 129, 0.8); /* Màu xám xanh đậm */
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border-color: rgba(184, 184, 184, 0.5);
        }
        .glass-card:hover { transform: translateY(-5px); }

        /* --- 4. NÚT TO (Màu Xanh Ngọc bạn thích) --- */
        .btn-primary {
            background: linear-gradient(135deg, #8fcbcf 0%, #3c5fa9 100%); 
            border: none;
            height: 68px;       
            padding: 0 60px;    
            font-size: 18px;     
            font-weight: 800;   
            border-radius: 100px;
            color: white !important;
            box-shadow: 0 10px 30px -5px rgba(13, 112, 158, 0.6);
            transition: all 0.3s ease;
        }
        .btn-primary:hover { 
            transform: scale(1.1) translateY(-2px); 
            box-shadow: 0 20px 40px -5px rgba(241, 221, 182, 0.8);
            color: white; 
        }
        
        /* --- 5. THEME SWITCH --- */
        .theme-switch { width: 64px; height: 32px; background: linear-gradient(135deg, #fdebd3, #f7e7db); border-radius: 999px; position: relative; cursor: pointer; border: 1px solid #f1d7c3; transition: all 0.35s ease; }
        .theme-switch::before { content: "🌞"; position: absolute; top: 3px; left: 4px; width: 26px; height: 26px; background: #e6fbff; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.35s ease; }
        .theme-switch.dark { background: linear-gradient(135deg, #afb6ca, #365d9c); border: 1px solid #3c4b62; }
        .theme-switch.dark::before { content: "🌙"; transform: translateX(32px); background: #1e40af; color: #fff; }

        /* --- 6. TEXT STROKE (GIỮ LẠI ĐỂ CHỮ NỔI) --- */
        .stroked-title {
        }
        .light .stroked-title {
            -webkit-text-stroke: 0; 
            text-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .dark .stroked-title {
            color: #121212 !important; 
            -webkit-text-stroke: 0;   
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.1); 
        }

        .outlined-desc {
            font-weight: 500;
        }
        .light .outlined-desc {
             color: #475569 !important; 
             text-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
        }
        .dark .outlined-desc {
            color: #e2e8f0 !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>

      <Header
        style={{
          background: "transparent",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 50px",
          height: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              borderRadius: 8,
            }}
          ></div>
          <Title level={4} style={{ margin: 0 }}>
            LoanSmart
          </Title>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            className={`theme-switch ${darkMode ? "dark" : ""}`}
            onClick={() => {
              setDarkMode(!darkMode);
              setManualToggle(true);
            }}
          />
          <Button
            type="text"
            icon={<LockOutlined />}
            onClick={() => navigate("/admin")}
            style={{ fontWeight: 600, color: darkMode ? "#cbd5e1" : "#475569" }}
          >
            Staff Login
          </Button>
        </div>
      </Header>

      <Content
        style={{ padding: "60px 50px", display: "flex", alignItems: "center" }}
      >
        <Row
          gutter={[48, 48]}
          align="middle"
          style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}
        >
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large">
              <div>
                <Text
                  strong
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: "#38bdf8",
                    fontWeight: 800,
                  }}
                >
                  🪙 Simple. Fast. Secure.
                </Text>

                <Title
                  level={1}
                  className="stroked-title"
                  style={{
                    fontSize: "64px",
                    margin: "10px 0",
                    lineHeight: 1.1,
                    fontWeight: 900,
                  }}
                >
                  Instant Loans. <br />
                  Zero Hassle.
                </Title>
              </div>

              <Paragraph
                className="outlined-desc"
                style={{ fontSize: "18px", maxWidth: 500 }}
              >
                Get the financial support you need in seconds. No paperwork, no
                hidden fees. Just a fair and transparent process designed for
                you.
              </Paragraph>

              <div style={{ marginTop: 10 }}>
                <Button
                  className="btn-primary"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/apply")}
                >
                  Get Your Loan Now
                </Button>
              </div>

              <Row gutter={32} style={{ marginTop: 40 }}>
                <Col>
                  <Statistic
                    title={
                      <span style={{ fontSize: 12, opacity: 0.7 }}>
                        Approval Time
                      </span>
                    }
                    value="< 2 Mins"
                    valueStyle={{ fontWeight: 700 }}
                  />
                </Col>
                <Col>
                  <Statistic
                    title={
                      <span style={{ fontSize: 12, opacity: 0.7 }}>
                        Client Satisfaction
                      </span>
                    }
                    value="98%"
                    valueStyle={{ fontWeight: 700 }}
                  />
                </Col>
              </Row>
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card className="glass-card" bordered={false}>
                  <Space align="center" size="large">
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        background: "#b3dcf8",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ThunderboltOutlined
                        style={{ fontSize: 24, color: "#0ea5e9" }}
                      />
                    </div>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        Lightning Fast
                      </Title>
                      <Text type="secondary">
                        Money in your account within minutes
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  className="glass-card"
                  bordered={false}
                  style={{
                    height: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <SafetyCertificateOutlined
                    style={{ fontSize: 40, color: "#10b981", marginBottom: 16 }}
                  />
                  <Title level={5} style={{ margin: 0 }}>
                    100% Secure
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Bank-level Data Protection
                  </Text>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  className="glass-card"
                  bordered={false}
                  style={{
                    height: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <RocketOutlined
                    style={{ fontSize: 40, color: "#f59e0b", marginBottom: 16 }}
                  />
                  <Title level={5} style={{ margin: 0 }}>
                    Fair & Clear
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Transparent Interest Rates
                  </Text>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: "center", background: "transparent" }}>
        <Text type="secondary">
          <strong>Loan System ©2026 Created by My Tuyen</strong>
        </Text>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
