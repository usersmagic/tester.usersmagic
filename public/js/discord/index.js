window.onload = () => {

  const code = window.location.href.split("code=")[1];

  const data = {
    code: code
  }

  if (code != ""){
    serverRequest('/discord', 'POST', data, res =>{
      // res is a simply message, if the user's discord_id has been added to the mongo
      // res: {success: "true"} or {success: "false"}
      console.log(res)
      // the redirection must be done after server confirms that the user was able to log in via discord
      window.location.assign("/profile")
    });
  }

}
