import { React } from 'nylas-exports';
import request from 'superagent';
import { remote } from 'electron';
const { BrowserWindow } = remote;

export default class Login extends React.Component{

    static propTypes = {
        credentials: React.PropTypes.object
    }

    render(){
        return <button className="n1todoist-loginbtn" onClick={this.handleLoginClick}> Login </button>
    }

    handleLoginClick = () => {
        const loginUrl = this.props.credentials.oauth + '?client_id=' + this.props.credentials.clientId + '&scope=' + this.props.credentials.scopes;
        this.loginWindow = new BrowserWindow({ width: 400, height: 500, show: false, 'node-integration': false });
        this.loginWindow.loadURL(loginUrl);
        this.loginWindow.show();
        this.loginWindow.webContents.on('did-get-redirect-request',this.handleLoginCallback);
    }

    handleLogoutClick = () => {
        localStorage.removeItem("N1todoist_authentication");
        this.setState({authenticated: false});
    }

    handleLoginCallback = (event, oauthUrl, tokenUrl) => {
        const rawCode = /code=([^&]*)/.exec(tokenUrl)
        if (rawCode && rawCode.length > 1){
            const code = rawCode[1]
            request.post("https://todoist.com/oauth/access_token")
            .send({ client_id: this.props.credentials.clientId, client_secret: this.props.credentials.clientSecret, code: code, redirect_uri: "https://alexfruehwirth.codes" })
            .set('Content-Type','application/x-www-form-urlencoded')
            .end(this.handleAccessTokenResponse)
        }
    }

    handleAccessTokenResponse = (error, response) => {
        if(response && response.ok){
            localStorage.setItem('N1todoist_authentication', response.body.access_token)
            this.props.whenLoggedIn();
            this.loginWindow.destroy();
        }else{
            console.log(error);
        }
    }
}
