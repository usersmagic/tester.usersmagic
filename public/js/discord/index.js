window.onload = () => {

  const code = window.location.href.split("code=")[1];

  const data = {
    code: code
  }

  if (code != ""){
    serverRequest('/discord', 'POST', data, res =>{
      console.log(res)
    });
  }

}
