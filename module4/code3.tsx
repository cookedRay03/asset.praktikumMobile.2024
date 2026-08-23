// 1.1 SANITIZE INPUTS & VALIDATION
const handleAuth = async () => {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();
  const cleanCallsign = callsign.trim();

  if (!cleanEmail || !cleanPassword) {
    Alert.alert("Hold on, Operative!", "Please provide both an email and password to proceed.");
    return;
  }

  if (isRegistering && !cleanCallsign) {
    Alert.alert("Identity Missing", "Every operative in the field needs a tactical callsign!");
    return;
  }

  setLoading(true);
  try {
    // 1.2 SIGN UP WITH USER METADATA
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            callsign: cleanCallsign,
            role: "hero",
          },
        },
      });

      if (error) {
        Alert.alert("Recruitment Denied", error.message);
      } else {
        Alert.alert("Enlistment Successful!", "Credentials registered. Switch to Sign In to enter HQ!");
        setIsRegistering(false);
      }
    } else {
      // 1.3 SIGN IN OPERATION & ROUTER REDIRECT
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        Alert.alert("Access Denied", error.message);
      } else {
        router.replace("/");
      }
    }
  } catch (err) {
    Alert.alert("System Malfunction", "Unable to establish communication with HQ.");
    console.error("Auth Exception:", err);
  } finally {
    setLoading(false);
  }
};
