import {
    React
} from 'nylas-exports';
import request from 'superagent';
import {
    remote
} from 'electron';
var BrowserWindow = remote.BrowserWindow;

module.exports = React.createClass({

    render: function(){
        return <button onClick={this.handleLoginClick}> Login </button>
    },

    handleLoginClick: function(){
        loginWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
        loginUrl = this.props.credentials.oauth + '?client_id=' + this.props.credentials.clientId + '&scope=' + this.props.credentials.scopes;
        loginWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
        loginWindow.loadUrl(loginUrl)
        loginWindow.show();
        loginWindow.webContents.on('did-get-redirect-request',this.handleLoginCallback);
    },

    handleLogoutClick: function(){
        localStorage.removeItem("N1todoist_authentication");
        this.setState({authenticated: false});
    },


    handleLoginCallback: function(event, oauthUrl, tokenUrl){
        //loginWindow.destroy();

        var rawCode = /code=([^&]*)/.exec(tokenUrl)
        var code = null
        if (rawCode && rawCode.length > 1){
            var code = rawCode[1]
            request.post("https://todoist.com/oauth/access_token")
            .send({ client_id: this.props.credentials.clientId, client_secret: this.props.credentials.clientSecret, code: code, redirect_uri: "https://alexfruehwirth.codes" })
            .set('Content-Type','application/x-www-form-urlencoded')
            .end(this.handleAccessTokenResponse)
        }
    },

    handleAccessTokenResponse: function(error, response){
        if(response && response.ok){
            localStorage.setItem('N1todoist_authentication', response.body.access_token)
            this.props.whenLoggedIn();
            loginWindow.destroy();
        }else{
            console.log(error);
        }
    }
});
