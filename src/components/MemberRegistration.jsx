import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowBack, People } from "@mui/icons-material";
import { Fragment } from "react";

const MemberRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bloodGroup: "",
    age: "",
    gender: "",
    emergencyContact: "",
    membershipType: "monthly",
    joinDate: new Date().toISOString().split("T")[0],
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const generateMemberId = () => {
    const members = JSON.parse(localStorage.getItem("members") || "[]");
    const lastId =
      members.length > 0
        ? Math.max(...members.map((m) => parseInt(m.id.replace("GYM", ""))))
        : 0;
    return `GYM${String(lastId + 1).padStart(4, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === "")
      newErrors.name = "Name is required";
    if (!formData.email || formData.email.trim() === "")
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone || formData.phone.trim() === "")
      newErrors.phone = "Phone is required";
    if (!formData.address || formData.address.trim() === "")
      newErrors.address = "Address is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.age || formData.age < 16 || formData.age > 80)
      newErrors.age = "Age must be between 16 and 80";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.emergencyContact || formData.emergencyContact.trim() === "")
      newErrors.emergencyContact = "Emergency contact is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submit button clicked!"); // Debug alert
    console.log("Form submitted with data:", formData);

    // Validate form
    const validationErrors = validateForm();
    console.log("Validation errors:", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      alert("Validation failed: " + JSON.stringify(validationErrors));
      setErrors(validationErrors);
      return;
    }

    // Clear any existing errors
    setErrors({});

    const memberId = generateMemberId();
    const newMember = {
      ...formData,
      id: memberId,
      createdAt: new Date().toISOString(),
    };

    console.log("Saving member:", newMember);

    // Save to localStorage
    const members = JSON.parse(localStorage.getItem("members") || "[]");
    members.push(newMember);
    localStorage.setItem("members", JSON.stringify(members));

    console.log("Member saved successfully!");
    alert(`Member registered successfully! Member ID: ${memberId}`);
    setSuccess(`Member registered successfully! Member ID: ${memberId}`);
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      bloodGroup: "",
      age: "",
      gender: "",
      emergencyContact: "",
      membershipType: "monthly",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
    });
  };

  return (
    <Fragment>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #263b46 0%, #141720 100%)",
          py: 0,
          gap: 3,
        }}
      >
        {/* Header - Full Width */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(38, 59, 70, 0.15)",
            borderRadius: "0 0 8px 8px",
            animation: "zoomIn 0.6s ease-out",
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
                    px: { xs: 0.5, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
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
                    Member Registration
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    Register new gym member
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<People />}
                onClick={() => navigate("/members")}
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  fontWeight: "bold",
                  px: { xs: 1, sm: 1.5, md: 3 },
                  py: { xs: 0.5, sm: 0.75, md: 1 },
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
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

        <Container maxWidth="md" sx={{ mt: 4 }}>
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "8px",
                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
                "& .MuiAlert-message": {
                  color: "white",
                },
                "& .MuiAlert-icon": {
                  color: "#10b981",
                },
              }}
            >
              {success}
            </Alert>
          )}

          {/* Registration Form */}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              backgroundColor: "rgba(200, 200, 200, 0.15)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 30px 60px rgba(38, 59, 70, 0.25)",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Name */}
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
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
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              {/* Email */}
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
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
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              {/* Phone */}
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your phone number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                inputProps={{ maxLength: 11 }}
                error={!!errors.phone}
                helperText={errors.phone}
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
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              {/* Emergency Contact */}
              <TextField
                fullWidth
                size="small"
                placeholder="Enter emergency contact number"
                name="emergencyContact"
                type="tel"
                value={formData.emergencyContact}
                onChange={handleChange}
                inputProps={{ maxLength: 11 }}
                error={!!errors.emergencyContact}
                helperText={errors.emergencyContact}
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
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              {/* Address */}
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your full address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                error={!!errors.address}
                helperText={errors.address}
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
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              {/* Gender */}
              <FormControl fullWidth>
                <Select
                  size="small"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "rgba(255, 255, 255, 0.36)" }}>
                          Select Gender
                        </span>
                      );
                    }
                    return selected;
                  }}
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
                    "& .MuiSelect-select": {
                      color: "white",
                      padding: "10px 14px",
                    },
                    "& .MuiSelect-select.MuiSelect-selectMenu": {
                      color: formData.gender
                        ? "white"
                        : "rgba(255,255,255,0.7)",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Gender
                  </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>

              {/* Blood Group */}
              <FormControl fullWidth>
                <Select
                  size="small"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  displayEmpty
                  placeholder="Select Blood Group"
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "rgba(255, 255, 255, 0.36)" }}>
                          Select Blood Group
                        </span>
                      );
                    }
                    return selected;
                  }}
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
                    "& .MuiSelect-select": {
                      color: "white",
                      padding: "10px 14px",
                    },
                    "& .MuiSelect-select.MuiSelect-selectMenu": {
                      color: formData.bloodGroup
                        ? "white"
                        : "rgba(255,255,255,0.7)",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Blood Group
                  </MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
                {errors.bloodGroup && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.bloodGroup}
                  </Typography>
                )}
              </FormControl>

              {/* Age */}
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your age (16-80)"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                inputProps={{ min: 16, max: 80 }}
                error={!!errors.age}
                helperText={errors.age}
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
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />

              {/* Membership Type */}
              <FormControl fullWidth>
                <Select
                  size="small"
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "rgba(255, 255, 255, 0.36)" }}>
                          Select Membership Type
                        </span>
                      );
                    }
                    return selected;
                  }}
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
                    },
                    "& .MuiSelect-select.MuiSelect-selectMenu": {
                      color:
                        formData.membershipType !== "monthly"
                          ? "white"
                          : "rgba(255,255,255,0.7)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.9)",
                      "&.Mui-focused": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Membership Type
                  </MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>

              {/* Join Date */}
              <TextField
                fullWidth
                size="small"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  },
                }}
              />
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* All Fields Here */}

              {/* Submit Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  gap: { xs: 1, sm: 2 },
                  mt: 4,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                      sx={{
              background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)',
              color:"white",
              '&:hover': {
                background: 'linear-gradient(135deg, #1a2833 0%, #0a0c14 100%)',
              }
            }}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="outlined"     sx={{
              background: 'linear-gradient(135deg, #263b46 0%, #141720 100%)',
              color:"white",
              '&:hover': {
                background: 'linear-gradient(135deg, #1a2833 0%, #0a0c14 100%)',
              }
            }}>
                  Register Member
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(200, 200, 200, 0.15)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 25px 50px rgba(38, 59, 70, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", color: "white", fontWeight: "bold" }}
        >
          🎉 Registration Successful!
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
              {success}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Your member has been successfully registered in the gym management
              system.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: 3 }}>
          <Button
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/members");
            }}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
              },
            }}
          >
            View Members
          </Button>
          <Button
            onClick={() => {
              setShowSuccessModal(false);
              setSuccess("");
            }}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.8)",
                backgroundColor: "rgba(200, 200, 200, 0.15)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            Register Another
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default MemberRegistration;
