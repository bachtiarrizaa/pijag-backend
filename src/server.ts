import app from "./app";
import { appConfig } from "./config/app.config";

app.listen(appConfig.PORT, () => {
  console.log(`Server running on port ${appConfig.PORT} - it's Pijag Coffee`);
});