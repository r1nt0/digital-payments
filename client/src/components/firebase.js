import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
 //Go to firebase create an app and paste the configuration in here
};
firebase.initializeApp(config);
export default firebase