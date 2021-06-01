// This is for the communication between discord api login
const API_ENDPOINT = process.env.API_ENDPOINT;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URL = process.env.REDIRECT_URL;

module.exports = (req,res) =>{

  return res.render('discord/index', {
    page: 'discord/index',
    title: res.__('Usersmagic/Discord'),
    includes:{
      external: {
        css: ['page', 'fontawesome', 'navigation', 'campaigns', 'buttons', 'general', 'confirm'],
        js: ['page', 'confirm', 'serverRequest']
      }
    }
  })
}

function discordLogin(){

}
