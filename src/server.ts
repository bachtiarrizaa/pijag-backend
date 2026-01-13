import app from "./app";
import { appConfig } from "./config/app.config";

app.listen(appConfig.APP_PORT, appConfig.APP_HOST, () => {
  console.log(
    `Server running at http://${appConfig.APP_HOST}:${appConfig.APP_PORT} - it's Pijag Coffee`
  );
});