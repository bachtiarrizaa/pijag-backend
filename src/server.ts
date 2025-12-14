import app from "./app";
import { appConfig } from "./config/app.config";

app.listen(appConfig.APP_PORT, () => {
  console.log(`Server running on port ${appConfig.APP_PORT} - it's Pijag Coffee`);
});