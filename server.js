
const express = require("express");
const app = express();
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const port = 4000;
const data = ["JavaScript", "Python", "Java", "C", "PHP", "SQL", "C++", "TypeScript", "Ruby"]
app.get("/", async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'view/ejs-file.ejs');
        const generatedFilePath = path.join(__dirname, "node-generated-pdf.pdf");
        const fileHtmlData = await ejs.renderFile(filePath, {data});
        if (fileHtmlData) {
            const options = {
                "height": "11.25in",
                "width": "10.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(fileHtmlData, options).toFile(generatedFilePath, function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.set('Content-Type','application/octet-stream');
                    res.set('Content-Disposition',`attachment; filename=node-generated-pdf.pdf`);
                    return res.download(generatedFilePath, () => {
                        fs.unlink(generatedFilePath, function () {
                        });
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ "Error": error });
    }
});
app.listen(port, (error) => {
    if (error) {
        console.log(`Error starting server on Port: ${port} \n Error : ${err}`);
    }
    console.log(`Server in listening on url: http://127.0.0.1:${port}/`);;
} );