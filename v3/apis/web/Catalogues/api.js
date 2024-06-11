const CataloguesCreateFolder = require("../../../routes/web/Catalogues/createFolder");
const CataloguesGetFiles = require("../../../routes/web/Catalogues/getFiles");
const CataloguesDeleteFiles = require("../../../routes/web/Catalogues/deleteFiles");
const CataloguesUploadFiles = require("../../../routes/web/Catalogues/uploadFiles");

const CataloguesEndPoints = (app) => {
  app.use("/api/v3/CataloguesCreateFolder", CataloguesCreateFolder);
  app.use("/api/v3/CataloguesGetFiles", CataloguesGetFiles);
  app.use("/api/v3/CataloguesDeleteFiles", CataloguesDeleteFiles);
  app.use("/api/v3/CataloguesUploadFiles", CataloguesUploadFiles);
};

module.exports = { CataloguesEndPoints };
