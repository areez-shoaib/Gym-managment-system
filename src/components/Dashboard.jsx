import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import UsersIcon from "@mui/icons-material/People";
import CurrencyDollarIcon from "@mui/icons-material/AttachMoney";
import ChartBarIcon from "@mui/icons-material/BarChart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Footer from "./Footer";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLgScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
    pendingFees: 0,
    totalExpenses: 0,
  });
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const members = JSON.parse(localStorage.getItem("members") || "[]");
    const fees = JSON.parse(localStorage.getItem("fees") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    const totalRevenue = fees.reduce(
      (sum, fee) => sum + parseFloat(fee.amount),
      0,
    );
    const pendingFees =
      members.filter((member) => member.status === "pending").length * 1500; // Updated to current monthly fee
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0,
    );

    setStats({
      totalMembers: members.length,
      totalRevenue,
      pendingFees,
      totalExpenses,
    });
  }, []);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
  };

  const cancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const menuItems = [
    {
      title: "Members",
      description: "View and manage gym members",
      icon: UsersIcon,
      color: "#3b82f6",
      action: () => navigate("/members"),
    },
    {
      title: "Member Registration",
      description: "Register new gym members",
      icon: PersonAddIcon,
      color: "#10b981",
      action: () => navigate("/register-member"),
    },
    {
      title: "Fee Management",
      description: "Collect and track member fees",
      icon: PaymentsIcon,
      color: "#f59e0b",
      action: () => navigate("/fees"),
    },
    {
      title: "Expenses",
      description: "Track gym expenses",
      icon: ReceiptIcon,
      color: "#ef4444",
      action: () => navigate("/expenses"),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #263b46 0%, #141720 100%)",
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "rgba(200, 200, 200, 0.15)",
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
              py: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isMobile && (
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: 'white' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  sx={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    fontFamily: "new times roman,serif",
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                  }}
                >
                  Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Welcome back, {user?.name}
                </Typography>
              </Box>
            </Box>
            {!isMobile && (
              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }} >
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item size={{ xs: 12, md: 3 }}>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 6, justifyContent: 'center', }}>
              <Grid item size={{ xs: 12, sm: 6, md: 12 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: 'fadeInUp 0.6s ease-out',
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.02)",
                      boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                      backgroundColor: "rgba(200, 200, 200, 0.2)",
                    },
                    height: { xs: "100%" },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: "100%"

                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                          fontFamily: "New York, serif"
                        }}
                        gutterBottom
                      >
                        Total Members
                      </Typography>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: "bold",
                          fontFamily: "new times roman,serif",
                          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.75rem' }
                        }}
                      >
                        {stats.totalMembers}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        borderRadius: "50%",
                        p: 2,
                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      <UsersIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: "white" }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6, md: 12 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: 'fadeInUp 0.6s ease-out',
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.02)",
                      boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                      backgroundColor: "rgba(200, 200, 200, 0.2)",
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%',

                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                          fontFamily: "New York, serif"
                        }}
                        gutterBottom
                      >
                        Total Revenue
                      </Typography>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: "bold",
                          fontFamily: "new times roman,serif",
                          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.75rem' }
                        }}
                      >
                        Rs : {stats.totalRevenue.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        borderRadius: "50%",
                        p: 2,
                        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      <CurrencyDollarIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: "white" }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6, md: 12 }} >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: 'fadeInUp 0.6s ease-out',
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.02)",
                      boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                      backgroundColor: "rgba(200, 200, 200, 0.2)",
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%',

                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                          fontFamily: "New York, serif"
                        }}
                        gutterBottom
                      >
                        Pending Fees
                      </Typography>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: "bold",
                          fontFamily: "new times roman,serif",
                          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.75rem' }
                        }}
                      >
                        Rs : {stats.pendingFees.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        borderRadius: "50%",
                        p: 2,
                        boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                      }}
                    >
                      <ChartBarIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: "white" }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6, md: 12 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: 'fadeInUp 0.6s ease-out',
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.02)",
                      boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                      backgroundColor: "rgba(200, 200, 200, 0.2)",
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%',

                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                          fontFamily: "New York, serif"
                        }}
                        gutterBottom
                      >
                        Total Expenses
                      </Typography>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: "bold",
                          fontFamily: "new times roman,serif",
                          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.75rem' }
                        }}
                      >
                        Rs : {stats.totalExpenses.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        borderRadius: "50%",
                        p: 2,
                        boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                      }}
                    >
                      <CreditCardIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: "white" }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item size={{ xs: 12, md: 9 }}>
            {!isMobile && (
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: "550px",
                  backgroundColor: "rgba(200, 200, 200, 0.15)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                  width: "100%"
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    fontFamily: "new times roman,serif",
                  }}
                >
                  Quick Actions
                </Typography>

                <Grid container spacing={3} >
                  {menuItems.map((item, index) => (
                    <Grid item size={{ xs: 12, md: 12 }} key={index} sx={{ width: '100%', minHeight: "90px" }} >
                      <Paper
                        elevation={2}
                        sx={{
                          height: "100%",
                          p: 1.5,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          transform: "translateY(0)",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: "0 10px 25px rgba(38, 59, 70, 0.1)",
                          "&:hover": {
                            transform: "translateY(-5px) scale(1.05)",
                            boxShadow: "0 15px 35px rgba(38, 59, 70, 0.2)",
                            backgroundColor: "rgba(200, 200, 200, 0.15)",
                            "& .arrow-icon": {
                              color: "white",
                              transform: "translateX(5px)"
                            }
                          },
                          "&:active": {
                            transform: "translateY(-2px) scale(1.02)",
                            backgroundColor: item.color,
                            border: `2px solid ${item.color}`,
                            boxShadow: `0 8px 25px ${item.color}40`,
                            "& .arrow-icon": {
                              color: "white",
                              transform: "translateX(3px)"
                            }
                          },
                        }}
                        onClick={item.action}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                backgroundColor: item.color,
                                borderRadius: "50%",
                                p: 2,
                                mr: 2,
                              }}
                            >
                              <item.icon sx={{ fontSize: 30, color: "white" }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "white",
                                  fontSize: { xs: '0.5rem', sm: '1rem' },
                                  fontWeight: "bold"
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.7)",
                                  fontSize: { xs: '0.3rem', sm: '0.75rem' }
                                }}
                              >
                                {item.description}
                              </Typography>
                            </Box>
                          </Box>
                          <ArrowForwardIcon
                            className="arrow-icon"
                            sx={{
                              fontSize: 20,
                              color: item.color,
                              transition: "all 0.3s ease"
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
      {/* Logout Confirmation Modal */}
      <Dialog
        open={logoutModalOpen}
        onClose={cancelLogout}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",

          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: { xs: "16px", sm: "20px", md: "20px" }, p: { xs: 1, sm: 3 } }}
        >
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.9)",
              mb: 2,
              fontSize: { xs: "12px", md: "16px" }
            }}
          >
            Are you sure you want to logout?
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)", fontSize: { xs: "12px", md: "14px" } }}
          >
            You will need to login again to access your dashboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: { xs: 1, sm: 3 } }}>
          <Button
            onClick={cancelLogout}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.7)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            No
          </Button>
          <Button
            onClick={confirmLogout}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #263b46 0%, #141720 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1a2833 0%, #0a0c14 100%)",
              },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'rgba(200, 200, 200, 0.15)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(38, 59, 70, 0.2)',
            width: 280,
          }
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              fontFamily: "new times roman,serif",
            }}
          >
            Quick Actions
          </Typography>
        </Box>
        <List sx={{ p: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => {
                item.action();
                setDrawerOpen(false);
              }}
              sx={{
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateX(5px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                secondary={item.description}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'white',
                    fontFamily: 'new times roman,serif',
                    fontWeight: 'medium',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </ListItem>
          ))}
          <ListItem
            onClick={() => {
              handleLogout();
              setDrawerOpen(false);
            }}
            sx={{
              mt: 2,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.3)',
                transform: 'translateX(5px)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                '& .MuiListItemText-primary': {
                  color: 'white',
                  fontFamily: 'new times roman,serif',
                  fontWeight: 'medium',
                },
              }}
            />
          </ListItem>
        </List>
      </Drawer>
      <Footer />
    </Box>
  );
};

// Add CSS animations
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}

export default Dashboard;