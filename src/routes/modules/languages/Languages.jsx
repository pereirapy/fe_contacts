import React from "react";
import PrivateRoute from "../../../utils/privateRoute";
import LanguageList from "../../../pages/Languages/LanguagesList";
import languagesPath from "./path";

const Routes = () => (
  <>
    <PrivateRoute
      exact
      path={languagesPath.LANGUAGES_LIST_PATH}
      component={LanguageList}
    />
  </>
);

export default Routes;
