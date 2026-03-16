import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Add,
  CheckCircle,
  AccessTime,
  People,
} from "@mui/icons-material";

const FeeManagement = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [fees, setFees] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [paymentData, setPaymentData] = useState({
    memberId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentType: "cash",
    month: new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    }),
  });

  useEffect(() => {
    // Load data from localStorage
    const storedMembers = JSON.parse(localStorage.getItem("members") || "[]");
    const storedFees = JSON.parse(localStorage.getItem("fees") || "[]");
    setMembers(storedMembers);
    setFees(storedFees);
  }, []);

  const getFeeAmount = (membershipType) => {
    switch (membershipType) {
      case "monthly":
        return 1500;
      case "quarterly":
        return 4000;
      case "yearly":
        return 15000;
      default:
        return 1500;
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    const newPayment = {
      id: `FEE${Date.now()}`,
      ...paymentData,
      timestamp: new Date().toISOString(),
    };

    const updatedFees = [...fees, newPayment];
    setFees(updatedFees);
    localStorage.setItem("fees", JSON.stringify(updatedFees));

    // Reset form
    setPaymentData({
      memberId: "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentType: "cash",
      month: new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    });
    setShowPaymentForm(false);
    setSelectedMember(null);
  };

  const handleMemberSelect = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setPaymentData((prev) => ({
        ...prev,
        memberId: member.id,
        amount: getFeeAmount(member.membershipType),
      }));
      setShowPaymentForm(true);
    }
  };

  const getMemberFeeStatus = (memberId) => {
    const memberFees = fees.filter((fee) => fee.memberId === memberId);
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const hasPaidThisMonth = memberFees.some(
      (fee) => fee.month === currentMonth,
    );
    return hasPaidThisMonth ? "paid" : "pending";
  };

  const getRecentPayments = () => {
    return fees
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  const getTotalRevenue = () => {
    return fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
  };

  const getPendingFees = () => {
    return members
      .filter((member) => getMemberFeeStatus(member.id) === "pending")
      .reduce((sum, member) => sum + getFeeAmount(member.membershipType), 0);
  };

  return (
<Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #263b46 0%, #141720 100%)",
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
          animation: "bounceIn 0.8s ease-out",
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/dashboard")}
                sx={{
                  color: "white",
                  minWidth: { xs: "auto", sm: "auto" },
                  px: { xs: 1, sm: 2 },
                  "&:hover": { backgroundColor: "rgba(200, 200, 200, 0.15)" },
                }}
              ></Button>
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    fontFamily: "new times roman,serif",
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  }}
                >
                  Fee Management
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Manage member fees and payments
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<People />}
              onClick={() => navigate("/members")}
              sx={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                fontWeight: "bold",
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: "8px",
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: { xs: "auto", sm: "auto" },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                  "& .MuiSvgIcon-root": {
                    transform: "scale(1.1)",
                    transition: "transform 0.3s ease",
                  },
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                },
              }}
            >
              {window.innerWidth < 600 ? "View" : "View Members"}
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                width: "100%",
                minWidth: 250,
                maxWidth: 300,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    gutterBottom
                  >
                    Total Revenue
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Times New Roman, serif",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{}}>Rs :</span>
                    {getTotalRevenue()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    p: { xs: 1.5, sm: 2 },
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle
                    sx={{
                      fontSize: { xs: 24, sm: 28, md: 32 },
                      color: "#10b981",
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                width: "100%",
                minWidth: 250,
                maxWidth: 300,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    gutterBottom
                  >
                    Pending Fees
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Times New Roman, serif",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    <span
                      style={{}}
                      sx={{
                        fontSize: {
                          xs: "0.75rem",
                          sm: "1rem",
                          md: "1.125rem",
                        },
                      }}
                    >
                      Rs :
                    </span>
                    {getPendingFees()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    p: { xs: 1.5, sm: 2 },
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessTime
                    sx={{
                      fontSize: { xs: 24, sm: 28, md: 32 },
                      color: "#f59e0b",
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                width: "100%",
                minWidth: 250,
                maxWidth: 300,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontFamily: "Times New Roman, serif",
                      fontWeight: "bold",
                    }}
                    gutterBottom
                  >
                    Total Payments
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    {fees.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    p: { xs: 1.5, sm: 2 },
                    width: { xs: 48, sm: 56, md: 64 },
                    height: { xs: 48, sm: 56, md: 64 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Add
                    sx={{
                      fontSize: { xs: 24, sm: 28, md: 32 },
                      color: "#3b82f6",
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ flexDirection: "column" }}>
          {/* Members Fee Status */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Member Fee Status
              </Typography>
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {members.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      py: 4,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    No members registered yet
                  </Typography>
                ) : (
                  members.map((member) => {
                    const status = getMemberFeeStatus(member.id);
                    return (
                      <Box
                        key={member.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                          },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontFamily: "Times New Roman, serif" }}
                          >
                            {member.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFamily: "Times New Roman, serif" }}
                          >
                            {member.id}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Chip
                            label={status === "paid" ? "Paid" : "Pending"}
                            size="small"
                            color={status === "paid" ? "success" : "warning"}
                            sx={{ fontWeight: "bold" }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleMemberSelect(member.id)}
                            sx={{
                              background:
                                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                              },
                            }}
                          >
                            Collect Fee
                          </Button>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Payments */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                Recent Payments
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Member
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Month
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Amount
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Type
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fees.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{
                            textAlign: "center",
                            py: 4,
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          No payments recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      getRecentPayments().map((fee) => {
                        const member = members.find(
                          (m) => m.id === fee.memberId,
                        );
                        return (
                          <TableRow key={fee.id} hover>
                            <TableCell sx={{ color: "white" }}>
                              {member?.name || "Unknown"}
                            </TableCell>
                            <TableCell
                              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              {fee.month}
                            </TableCell>
                            <TableCell
                              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              {new Date(fee.paymentDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  <span>
                                    <span
                                      style={{
                                        fontFamily: "Times New Roman, serif",
                                        fontSize: {
                                          xs: "0.625rem",
                                          sm: "0.875rem",
                                          md: "1rem",
                                        },
                                      }}
                                    >
                                      Rs :
                                    </span>
                                    {fee.amount}
                                  </span>
                                }
                                size="small"
                                color="success"
                                sx={{ fontWeight: "bold" }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={fee.paymentType}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  color: "white",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Payment Form Dialog */}
        <Dialog
          open={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: "rgba(200,200,200,0.15)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{ fontFamily: "Times New Roman, serif", color: "white" }}
          >
            Record Payment
          </DialogTitle>
          <DialogContent>
            {selectedMember && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{ fontFamily: "Times New Roman, serif" }}
                >
                  {selectedMember.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "Times New Roman, serif" }}
                >
                  {selectedMember.id} • Membership:{" "}
                  {selectedMember.membershipType}
                </Typography>
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handlePaymentSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <TextField
                type="number"
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                fullWidth
                required
                InputLabelProps={{
                  sx: { fontFamily: "Times New Roman, serif", color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",

                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    },

                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                    },

                    "& fieldset": {
                      border: "none",
                    },
                  },

                  "& input": {
                    color: "white",
                    fontFamily: "Times New Roman, serif",
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              <TextField
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    paymentDate: e.target.value,
                  }))
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  sx: { fontFamily: "Times New Roman, serif" },
                }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",

                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    },

                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                    },

                    "& fieldset": {
                      border: "none",
                    },
                  },

                  "& input": {
                    color: "white",
                    fontFamily: "Times New Roman, serif",
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              <TextField
                value={paymentData.month}
                onChange={(e) =>
                  setPaymentData((prev) => ({ ...prev, month: e.target.value }))
                }
                placeholder="e.g., January 2024"
                fullWidth
                required
                InputLabelProps={{
                  sx: { fontFamily: "Times New Roman, serif" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",

                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    },

                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                    },

                    "& fieldset": {
                      border: "none",
                    },
                  },

                  "& input": {
                    color: "white",
                    fontFamily: "Times New Roman, serif",
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              <FormControl fullWidth>
                <Select
                  value={paymentData.paymentType}
                  label="Payment Type"
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      paymentType: e.target.value,
                    }))
                  }
                  sx={{
                    backgroundColor: "rgba(200, 200, 200, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",

                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    },

                    "&.Mui-focused": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                    },

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },

                    "& .MuiSelect-select": {
                      color: "white",
                      fontFamily: "Times New Roman, serif",
                    },

                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => {
                setShowPaymentForm(false);
                setSelectedMember(null);
              }}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              Record Payment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 2,
          px: 2,
          mx: "auto",
          maxWidth: "600px",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "50px",
          mt: 4,
          mb: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.75rem",
            fontFamily: "Times New Roman, serif",
          }}
        >
          © 2026 | Areez Korai Gym Management System | All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default FeeManagement;
