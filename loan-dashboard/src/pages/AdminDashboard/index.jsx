import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoanContext } from "../../contexts/LoanContext";
import axios from "axios";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Segmented,
  Form,
  Input,
  Typography,
  Tooltip,
} from "antd";
import {
  ArrowDownOutlined,
  DeleteOutlined,
  SyncOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  UserOutlined,
  LogoutOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { loanRecords, deleteRecord } = useContext(LoanContext);
  const [chartMode, setChartMode] = useState("Day");
  const [serverStatus, setServerStatus] = useState("checking");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- 1. LOGIC DARK MODE ---
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

  // --- 2. BỘ MÀU PASTEL DỊU MẮT ---
  const COLORS = {
    green: darkMode ? "#34d399" : "#389e0d",
    red: darkMode ? "#f87171" : "#cf1322",
    yellow: darkMode ? "#fbbf24" : "#d48806",
    textMain: darkMode ? "#e2e8f0" : "#343c4b",
    textSub: darkMode ? "#94a3b8" : "#64748b",
  };

  // --- 3. CHECK SERVER ---
  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get("http://127.0.0.1:5000/");
        setServerStatus("online");
      } catch (error) {
        setServerStatus("offline");
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 4. LOGIC CHART ---
  const parseDateStr = (str) => {
    if (!str) return null;
    try {
      if (str.includes(" - ")) {
        const parts = str.split(" - ");
        const [d, m, y] = parts[1].split("/");
        return { d, m, y, full: parts[1], month: `${m}/${y}` };
      }
      const [d, m, y] = str.split("/");
      return { d, m, y, full: str, month: `${m}/${y}` };
    } catch (e) {
      return null;
    }
  };

  const dailyData = useMemo(() => {
    const group = {};
    loanRecords.forEach((record) => {
      const dateInfo = parseDateStr(record.date);
      if (!dateInfo) return;
      const key = dateInfo.full;
      if (!group[key])
        group[key] = {
          name: key,
          approved: 0,
          rejected: 0,
          sortVal: new Date(
            `${dateInfo.y}-${dateInfo.m}-${dateInfo.d}`,
          ).getTime(),
        };
      if (record.status === "approved") group[key].approved++;
      if (record.status === "rejected") group[key].rejected++;
    });
    return Object.values(group).sort((a, b) => a.sortVal - b.sortVal);
  }, [loanRecords]);

  const monthlyData = useMemo(() => {
    const group = {};
    loanRecords.forEach((record) => {
      const dateInfo = parseDateStr(record.date);
      if (!dateInfo) return;
      const key = dateInfo.month;
      if (!group[key])
        group[key] = {
          name: key,
          approved: 0,
          rejected: 0,
          sortVal: new Date(`${dateInfo.y}-${dateInfo.m}-01`).getTime(),
        };
      if (record.status === "approved") group[key].approved++;
      if (record.status === "rejected") group[key].rejected++;
    });
    return Object.values(group).sort((a, b) => a.sortVal - b.sortVal);
  }, [loanRecords]);

  const pieData = useMemo(() => {
    let approved = 0,
      rejected = 0,
      pending = 0;
    loanRecords.forEach((r) => {
      if (r.status === "approved") approved++;
      else if (r.status === "rejected") rejected++;
      else pending++;
    });
    return [
      { name: "Approved", value: approved },
      { name: "Rejected", value: rejected },
      { name: "Pending", value: pending },
    ].filter((i) => i.value > 0);
  }, [loanRecords]);

  const currentChartData = chartMode === "Day" ? dailyData : monthlyData;

  const formatCurrency = (value) => {
    if (!value) return "0";
    const number = Number(String(value).replace(/[^0-9.-]+/g, ""));
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const handleLogin = (values) => {
    if (values.username === "admin" && values.password === "tuyen1606@") {
      message.success("Login Successful!");
      setIsLoggedIn(true);
    } else {
      message.error("Invalid Username or Password!");
    }
  };

  const handleDelete = (key) => {
    deleteRecord(key);
    message.success("Deleted successfully!");
  };

  // --- 5. CUSTOM TOOLTIP ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: darkMode ? "rgba(30, 41, 59, 0.95)" : "#fff",
            border: `1px solid ${darkMode ? "#334155" : "#f0f0f0"}`,
            padding: "10px 14px",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {label && (
            <p
              style={{
                color: darkMode ? "#94a3b8" : "#64748b",
                marginBottom: 8,
                fontSize: 12,
              }}
            >
              {label}
            </p>
          )}
          {payload.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: entry.color || entry.payload.fill,
                }}
              />
              <span
                style={{
                  color: darkMode ? "#fff" : "#000",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
      align: "center",
      fixed: "left",
      render: (text) => (
        <span style={{ fontWeight: 600, color: COLORS.textMain }}>{text}</span>
      ),
    },
    {
      title: "Income",
      dataIndex: "income",
      key: "income",
      width: 150,
      align: "center",
      sorter: (a, b) => {
        const numA = Number(String(a.income).replace(/[^0-9.-]+/g, ""));
        const numB = Number(String(b.income).replace(/[^0-9.-]+/g, ""));
        return numA - numB;
      },
      render: (val) => (
        <span style={{ color: COLORS.textSub }}>{formatCurrency(val)}</span>
      ),
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      key: "loanAmount",
      width: 160,
      align: "center",
      sorter: (a, b) => {
        const numA = Number(String(a.loanAmount).replace(/[^0-9.-]+/g, ""));
        const numB = Number(String(b.loanAmount).replace(/[^0-9.-]+/g, ""));
        return numA - numB;
      },
      render: (val) => (
        <span style={{ fontWeight: 700, color: COLORS.textSub }}>
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      title: "Score",
      dataIndex: "creditScore",
      key: "creditScore",
      width: 100,
      align: "center",
      sorter: (a, b) => a.creditScore - b.creditScore,
      render: (score) => (
        <Tag
          color={
            score >= 700
              ? darkMode
                ? "rgba(52, 211, 153, 0.2)"
                : "success"
              : score >= 455
                ? darkMode
                  ? "rgba(251, 191, 36, 0.2)"
                  : "warning"
                : darkMode
                  ? "rgba(248, 113, 113, 0.2)"
                  : "error"
          }
          style={{
            color:
              score >= 700
                ? COLORS.green
                : score >= 455
                  ? COLORS.yellow
                  : COLORS.red,
            borderColor:
              score >= 700
                ? COLORS.green
                : score >= 455
                  ? COLORS.yellow
                  : COLORS.red,
            fontWeight: 600,
          }}
        >
          {score}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      filters: [
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (s) => {
        const isApproved = s === "approved";
        return (
          <Tag
            color={
              isApproved
                ? darkMode
                  ? "rgba(52, 211, 153, 0.15)"
                  : "success"
                : darkMode
                  ? "rgba(248, 113, 113, 0.15)"
                  : "error"
            }
            style={{
              width: 90,
              textAlign: "center",
              fontWeight: 700,
              color: isApproved ? COLORS.green : COLORS.red,
              border: `1px solid ${isApproved ? COLORS.green : COLORS.red}`,
            }}
          >
            {s?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Risk Analysis",
      dataIndex: "reason",
      key: "reason",
      width: 220, // Tăng độ rộng cột để chứa được nhiều chữ hơn
      align: "center",
      render: (text, record) => {
        if (record.status === "approved") {
          return (
            <span
              style={{
                color: COLORS.green,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <CheckCircleOutlined /> Safe
            </span>
          );
        }
        if (record.status === "rejected") {
          return (
            <Tooltip
              title={text || "Dữ liệu cũ (Chưa rõ lý do)"}
              placement="topLeft"
            >
              <span
                style={{
                  color: COLORS.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // Vẫn căn giữa
                  gap: 6,
                  cursor: "help",
                  width: "100%",
                }}
              >
                <WarningOutlined style={{ flexShrink: 0 }} />
                {/* 👇 ĐÃ SỬA: Bỏ giới hạn chiều rộng cứng nhắc để chữ hiện đầy đủ */}
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "180px", // Nới rộng ra
                  }}
                >
                  {text || "Dữ liệu cũ..."}
                </span>
              </span>
            </Tooltip>
          );
        }
        return (
          <span style={{ color: "#bfbfbf", fontStyle: "italic", fontSize: 12 }}>
            Checking...
          </span>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 160,
      align: "center",
      sorter: (a, b) => {
        const toTime = (str) => {
          if (!str) return 0;
          try {
            const parts = str.split(" - ");
            if (parts.length < 2) return 0;
            const [d, m, y] = parts[1].split("/");
            return new Date(`${y}-${m}-${d}T${parts[0]}`).getTime();
          } catch {
            return 0;
          }
        };
        return toTime(a.date) - toTime(b.date);
      },
      render: (t) => (
        <span style={{ fontSize: 13, color: COLORS.textSub }}>{t}</span>
      ),
    },
    {
      title: "Action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, r) => (
        <Popconfirm
          title="Delete?"
          onConfirm={() => handleDelete(r.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            style={{ color: COLORS.textSub }}
          />
        </Popconfirm>
      ),
    },
  ];

  // --- STYLES CHO CARD ---
  const cardStyle = {
    background: darkMode ? "#1e293b" : "#ffffff",
    borderColor: darkMode ? "#334155" : "#f0f0f0",
    color: darkMode ? "#ffffff" : "#000000",
  };

  const styles = `
    .theme-switch { width: 50px; height: 26px; background: linear-gradient(135deg, #3c261d, #897969); border-radius: 999px; position: relative; cursor: pointer; border: 1px solid #0e0e0e; transition: all 0.35s ease; }
    .theme-switch::before { content: "🌞"; position: absolute; top: 1px; left: 3px; width: 22px; height: 22px; background: #80e5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.35s ease; font-size: 12px; }
    .theme-switch.dark { background: linear-gradient(135deg, #b9c3ce, #0e182a); border: 1px solid #475569; }
    .theme-switch.dark::before { content: "🌙"; transform: translateX(22px); background: #3d5cd8; color: #fff; }
    
    /* === FIX LỖI BẢNG === */
    .dark-mode .ant-table, .dark-mode .ant-table-container, .dark-mode .ant-table-content { background: transparent !important; }
    .dark-mode .ant-table-cell { background-color: #1e293b !important; color: #e2e8f0 !important; border-bottom: 1px solid #334155 !important; }
    .dark-mode .ant-table-tbody > tr:hover > td { background-color: #334155 !important; }
    .dark-mode .ant-table-thead > tr > th { background-color: #0f172a !important; color: white !important; border-bottom: 1px solid #475569 !important; font-weight: bold !important; }
    .dark-mode .ant-empty-description { color: #94a3b8 !important; }
    .dark-mode .ant-pagination-item a { color: #fff !important; }
    .dark-mode .ant-pagination-item-active { background: transparent !important; border-color: #1890ff !important; }
    .dark-mode .ant-card-head { color: white !important; border-bottom: 1px solid #334155 !important; }
    .dark-mode .ant-statistic-title { color: #94a3b8 !important; }
  `;

  // --- RENDER LOGIN ---
  if (!isLoggedIn) {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #0f172a 0%, #020617 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <style>{styles}</style>
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <div
            className={`theme-switch ${darkMode ? "dark" : ""}`}
            onClick={() => {
              setDarkMode(!darkMode);
              setManualToggle(true);
            }}
          />
        </div>
        <Card
          style={{
            width: 500,
            borderRadius: 20,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            background: darkMode
              ? "rgba(30, 41, 59, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            padding: "20px",
            border: darkMode ? "1px solid #334155" : "none",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div
              style={{
                background: "#e6f7ff",
                width: 80,
                height: 80,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <LockOutlined style={{ fontSize: 40, color: "#1890ff" }} />
            </div>
            <Title
              level={2}
              style={{
                marginTop: 20,
                color: darkMode ? "white" : "#001529",
                marginBottom: 5,
              }}
            >
              Admin Portal
            </Title>
            <p
              style={{
                color: darkMode ? "#94a3b8" : "#64748b",
                fontSize: "16px",
                margin: 0,
              }}
            >
              Loan Assessment & Risk Analysis System
            </p>
          </div>
          <Form layout="vertical" onFinish={handleLogin} size="large">
            <Form.Item
              label={
                <span
                  style={{
                    fontWeight: 600,
                    color: darkMode ? "white" : "black",
                  }}
                >
                  Username
                </span>
              }
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter username" />
            </Form.Item>
            <Form.Item
              label={
                <span
                  style={{
                    fontWeight: 600,
                    color: darkMode ? "white" : "black",
                  }}
                >
                  Password
                </span>
              }
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  height: 45,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 10,
                }}
              >
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    );
  }

  // --- RENDER MAIN DASHBOARD ---
  return (
    <Layout
      className={darkMode ? "dark-mode" : ""}
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f0f2f5",
      }}
    >
      <style>{styles}</style>
      <Header
        style={{
          background: darkMode ? "#1e293b" : "#001529",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: darkMode ? "1px solid #334155" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BarChartOutlined style={{ color: "#fff", fontSize: 24 }} />
          <h2 style={{ color: "white", margin: 0, fontSize: 20 }}>
            Risk Monitor Center
          </h2>
        </div>
        <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
          <div
            className={`theme-switch ${darkMode ? "dark" : ""}`}
            onClick={() => {
              setDarkMode(!darkMode);
              setManualToggle(true);
            }}
          />
          <Button type="primary" ghost onClick={() => navigate("/")}>
            Home Page
          </Button>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => setIsLoggedIn(false)}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card style={cardStyle} bordered={false}>
              <Statistic
                title="Total Applications"
                value={loanRecords.length}
                prefix={
                  <SyncOutlined
                    spin={loanRecords.some((r) => r.status === "processing")}
                  />
                }
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={cardStyle} bordered={false}>
              <Statistic
                title="Rejected Rate"
                value={
                  loanRecords.length
                    ? (
                        (loanRecords.filter((r) => r.status === "rejected")
                          .length /
                          loanRecords.length) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix="%"
                prefix={<ArrowDownOutlined />}
                valueStyle={{ color: COLORS.red }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={cardStyle} bordered={false}>
              <Statistic
                title="AI System Status"
                value={serverStatus === "online" ? "Online" : "Offline"}
                valueStyle={{
                  color: serverStatus === "online" ? COLORS.green : COLORS.red,
                }}
                prefix={
                  serverStatus === "online" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )
                }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={14}>
            <Card title="Statistics" bordered={false} style={cardStyle}>
              <div style={{ float: "right", marginBottom: 10 }}>
                <Segmented
                  options={["Day", "Month"]}
                  value={chartMode}
                  onChange={setChartMode}
                />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={currentChartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={darkMode ? "#334155" : "#ccc"}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: darkMode ? "#94a3b8" : "#666" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: darkMode ? "#94a3b8" : "#666" }}
                  />

                  {/* Sử dụng Custom Tooltip */}
                  <RechartsTooltip
                    cursor={{ fill: "transparent" }}
                    content={<CustomTooltip />}
                  />

                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ color: darkMode ? "#fff" : "#000" }}
                  />
                  <Bar
                    dataKey="approved"
                    name="Approved"
                    fill={COLORS.green}
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rejected"
                    name="Rejected"
                    fill={COLORS.red}
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Risk Distribution" bordered={false} style={cardStyle}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => {
                      let color = "#d9d9d9";
                      if (entry.name === "Approved") color = COLORS.green;
                      if (entry.name === "Rejected") color = COLORS.red;
                      if (entry.name === "Pending") color = COLORS.yellow;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>

                  {/* Sử dụng Custom Tooltip */}
                  <RechartsTooltip content={<CustomTooltip />} />

                  <Legend
                    wrapperStyle={{ color: darkMode ? "#fff" : "#000" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Card
              title="Application Details"
              bordered={false}
              bodyStyle={{ padding: 0 }}
              style={cardStyle}
            >
              <Table
                dataSource={loanRecords}
                columns={columns}
                pagination={{ pageSize: 6 }}
                scroll={{ x: 1200 }}
                rowKey="key"
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
