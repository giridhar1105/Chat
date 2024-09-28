async function onRegister(e) {
    e.preventDefault();
    setLoading(true);
  
    try {
      const data = { username, password, gender, email, otp };
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (response.status === 201) {
        // Save user details to local storage
        localStorage.setItem("user", JSON.stringify({ username, gender, email }));
  
        setUsername("");
        setPassword("");
        setGender("Male");
        setEmail("");
        setOtp("");
        window.alert("Registration successful!");
        router.push("/Login");
      } else {
        window.alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err.message);
      window.alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  