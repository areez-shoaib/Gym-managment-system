import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  People,
  FitnessCenter,
  Payments,
  TrendingUp,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Fragment } from "react";

const Dashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load members from localStorage
    const storedMembers = JSON.parse(localStorage.getItem("members") || "[]");
    setMembers(storedMembers);

    // Calculate stats
    const totalMembers = storedMembers.length;
    const activeMembers = storedMembers.filter(
      (member) => member.status === "active"
    ).length;
    
    // Calculate revenue (mock data for now)
    const monthlyRevenue = activeMembers * 1000; // Assuming $1000/month per active member
    const totalRevenue = monthlyRevenue * 12; // Annual revenue estimate

    setStats({
      totalMembers,
      activeMembers,
      totalRevenue,
      monthlyRevenue,
    });
  };

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "rgba(16, 185, 129, 0.3)",
    },
    {
      title: "Active Members",
      value: stats.activeMembers,
      icon: <FitnessCenter sx={{ fontSize: 40 }} />,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      title: "Monthly Revenue",
      value: `Rs ${stats.monthlyRevenue.toLocaleString()}`,
      icon: <Payments sx={{ fontSize: 40 }} />,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "rgba(245, 158, 11, 0.3)",
    },
    {
      title: "Total Revenue",
      value: `Rs ${stats.totalRevenue.toLocaleString()}`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgba(239, 68, 68, 0.3)",
    },
  ];

  const quickActions = [
    {
      title: "Add Member",
      icon: <Add />,
      color: "#10b981",
      onClick: () => navigate("/member-registration"),
    },
    {
      title: "View Members",
      icon: <People />,
      color: "#3b82f6",
      onClick: () => navigate("/members"),
    },
    {
      title: "Fee Management",
      icon: <Payments />,
      color: "#f59e0b",
      onClick: () => navigate("/fee-management"),
    },
    {
      title: "Expenses",
      icon: <TrendingUp />,
      color: "#ef4444",
      onClick: () => navigate("/expenses"),
    },
  ];

  return (
    <Fragment>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #263b46 0%, #141720 100%)",
          py: 0,
        }}
      >
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: { xs: 2, sm: 3 },
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    fontFamily: "Times New Roman, serif",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    mt: 1,
                  }}
                >
                  Welcome back! Here's your gym management overview
                </Typography>
              </Box>
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Stats Cards - Full Width */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={6}
                  sx={{
                    height: "100%",
                    background: card.bgColor,
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${card.borderColor}`,
                    borderRadius: "1px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${card.color}40`,
                      background: card.bgColor.replace("0.1", "0.15"),
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "0.875rem",
                            mb: 1,
                            fontFamily: "Times New Roman, serif",
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: card.color,
                            fontWeight: "bold",
                            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                            fontFamily: "Times New Roman, serif",
                          }}
                        >
                          {card.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          backgroundColor: card.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions - Full Width */}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "1px",
              boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "white",
                mb: 3,
                fontWeight: "bold",
                fontFamily: "Times New Roman, serif",
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={action.onClick}
                    sx={{
                      py: 3,
                      px: 2,
                      height: "100%",
                      borderColor: `${action.color}50`,
                      backgroundColor: `${action.color}10`,
                      color: action.color,
                      fontWeight: "bold",
                      borderRadius: "1px",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "&:hover": {
                        borderColor: action.color,
                        backgroundColor: `${action.color}20`,
                        transform: "translateY(-3px)",
                        boxShadow: `0 10px 25px ${action.color}30`,
                      },
                    }}
                  >
                    {action.icon}
                    {action.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Members - Full Width */}
          <Paper
            elevation={6}
            sx={{
              mt: 4,
              p: 4,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "1px",
              boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Times New Roman, serif",
                }}
              >
                Recent Members
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate("/members")}
                sx={{
                  color: "#10b981",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                  },
                }}
              >
                View All
              </Button>
            </Box>
            <Box>
              {members.slice(0, 5).map((member) => (
                <Box
                  key={member.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontFamily: "Times New Roman, serif",
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {member.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/members/edit/${member.id}`)}
                      sx={{
                        color: "#3b82f6",
                        minWidth: "auto",
                        p: 1,
                        "&:hover": {
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                        },
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        // Handle delete
                      }}
                      sx={{
                        color: "#ef4444",
                        minWidth: "auto",
                        p: 1,
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                        },
                      }}
                    >
                      <Delete />
                    </Button>
                  </Box>
                </Box>
              ))}
              {members.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontFamily: "Times New Roman, serif",
                    }}
                  >
                    No members registered yet. Start by adding your first member!
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fragment>
  );
};

export default Dashboard;
