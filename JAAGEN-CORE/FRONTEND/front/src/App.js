import React from "react";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// import { Navigation } from "../NavigationBar";
// import { LandingPage } from "../LandingPage";
// import { RegisterPage } from "../RegisterPage";
// import { LoginPage } from "../LoginPage";
// import { PasswordForgetPage } from "../PasswordForgetPage";
// import { HomePage } from "../HomePage";
// import { AccountPage } from "../AccountPage";
// import { PoolsPage } from "../PoolsPage";
// import { AccountsWalletAddPage } from "../AccountsWalletAddPage";
// import { AccountsWalletVerifyWalletPage } from "../AccountsWalletVerifyWalletPage";
// import { AccountsWalletPage } from "../AccountsWalletPage";
// import { SettingsPage } from "../SettingsPage";

// import { route } from "../_constants";
// import { WithAuthentication } from "../_components";
// import { CreatePoolPage } from "../CreatePoolPage";
// import { PoolUIPage } from "../PoolUIPage";
// import { PoolCreatorUIPage } from "../PoolCreatorUIPage";

const MyApp = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={route.LANDING} component={() => <LandingPage />} />
      <Route exact path={route.SIGN_UP} component={() => <RegisterPage />} />
      <Route exact path={route.SIGN_IN} component={() => <LoginPage />} />
      <Route
        exact
        path={route.PASSWORD_FORGET}
        component={() => <PasswordForgetPage />}
      />
      <Route exact path={route.HOME} component={() => <HomePage />} />
      <Route exact path={route.ACCOUNT} component={() => <AccountPage />} />
      <Route exact path={route.SETTINGS} component={() => <SettingsPage />} />
      <Route exact path={route.MYPOOLS} component={() => <PoolsPage />} />
      <Route
        exact
        path={route.ACCOUNTWALLETADD}
        component={() => <AccountsWalletAddPage />}
      />
      <Route
        exact
        path={route.ACCOUNTWALLETVERIFY}
        component={() => <AccountsWalletVerifyWalletPage />}
      />
      <Route
        exact
        path={route.ACCOUNTWALLET}
        component={() => <AccountsWalletPage />}
      />
      <Route
        exact
        path={route.CREATEPOOL}
        component={() => <CreatePoolPage />}
      />
      <Route
        exact
        path={route.APOOL}
        component={props => <PoolUIPage {...props} />}
      />
      <Route
        exact
        path={route.APOOLCREATOR}
        component={props => <PoolCreatorUIPage {...props} />}
      />
    </div>
  </Router>
);

const AppWithAuth = WithAuthentication(MyApp);
export { AppWithAuth as App };
