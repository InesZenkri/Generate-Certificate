document.addEventListener("DOMContentLoaded", function () {
  const certificateForm = document.getElementById("certificateForm");

  const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const generatePDF = async (firstName, lastName, email) => {
    const existingPdfBytes = await fetch("./certificate.pdf").then((res) =>
      res.arrayBuffer()
    );

    const { PDFDocument, rgb } = PDFLib;

    // Load a PDFDocument from the existing PDF templete
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // I want to check the validety/existacy of the email too and then sen dthe certificate per mail to the given adress
    // Capitalize and Concatenatefirst and last names
    const formattedFirstName = capitalize(firstName);
    const formattedLastName = capitalize(lastName);
    console.log(email);
    const fullName = `${formattedFirstName} ${formattedLastName}`;

    /*Draw name*/
    const startX = 135; 
    const endX = 740; 
    const rangeWidth = endX - startX;
    let fontSize = 58; //initial 
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    let textWidth = font.widthOfTextAtSize(fullName, fontSize);
    if(textWidth > rangeWidth) {
      console.log("doesn't fit in");
      const scale = rangeWidth / textWidth;
      fontSize *= scale ;// chnage it (smaller) so the name fits in
      textWidth = font.widthOfTextAtSize(fullName, fontSize);
    }
    const textStartX = startX + (rangeWidth - textWidth) / 2;
    firstPage.drawText(fullName, {
      x: textStartX,
      y: 270,
      size: fontSize,
      color: rgb(0.71, 0.514, 0.839),
    });

    // Serialize the PDFDocument to bytes
    pdfDoc.setTitle('Your Certificate From Ines');
    const pdfBytes = await pdfDoc.save();
    console.log("Done creating");

    // Create a Blob and save the PDF
    const file = new Blob([pdfBytes], {
      type: "application/pdf;charset=utf-8",
    });
    saveAs(file, "Certificate.pdf")
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
    const attachmentData = reader.result.split(",")[1];
    const htmlBody = `
    <html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        overflow: auto;
      }

      .container,.reach-me-out {
        max-width: 841px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }

      h1 {
        color: #51287f;
      }

      .social-icons {
        list-style: none;
        padding: 0;
        display: flex;
        margin-top: 10px;
      	justify-content: space-around;
      }

      .social-icons li {
        margin-right: 10px;
      }

      .social-icons a {
        text-decoration: none;
        color: #007bff;
        display: flex;
        align-items: center;
        font-size: 14px;
      }

      .certificate-iframe {
        width: 100%;
        height: 300px; 
        border: 1px solid #ccc;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Congratulations, ${fullName}!</h1>
      <p>You have successfully received your certificate.</p>
      <iframe class="certificate-iframe" src="data:application/pdf;base64,${attachmentData}"></iframe>
    </div>
    <div class="reach-me-out">
      <p>Reach Me Out:</p>
      <ul class="social-icons">
        <li><a href="https://www.facebook.com/ines.zenkri.9"><i class="fab fa-facebook"></i> Facebook</a></li>
        <li><a href="https://www.instagram.com/ines_zenkri/"><i class="fab fa-instagram"></i> Instagram</a></li>
        <li><a href="https://www.linkedin.com/in/ines-zenkri/"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
        <li><a href="https://github.com/InesZenkri"><i class="fab fa-github"></i> GitHub</a></li>
      </ul>
    </div>
  </body>
</html>

  `;
    Email.send({
        SecureToken : "911842a0-e212-4398-bd0c-ae108dc9dc78",
        To : email , 
        From: {
          name: "Ines Zenkri",
          email: "ines@zenkri.com",
      },
        Subject: "Your Certificate",
        Body: htmlBody,
        Attachments: [
          {
            name: "Certificate.pdf",
            data: attachmentData,
          },
        ],
    })
  };
  };

  // Check valid Format of email
  const validateEmail = (email) => {
    const regex =  /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  certificateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstNameInput").value.trim();
    const lastName = document.getElementById("lastNameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    /*const apiKey = '616f406ce3534064bc86765bd18a93c7'; 
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

    function httpGetAsync(url, callback) {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          callback(xmlHttp.responseText);
        }
      };
      xmlHttp.open("GET", url, true);
      xmlHttp.send(null);
    }*/
    if (firstName !== "" && lastName !== "" && validateEmail(email)) {
      /*httpGetAsync(url, function(response) {
        if (response) {
          const data = JSON.parse(response);
          console.log('Response data:', data);
          if (data.deliverability === 'DELIVERABLE') {*/
            generatePDF(firstName, lastName, email);
            document.getElementById("firstNameInput").value = "";
            document.getElementById("lastNameInput").value = "";
            document.getElementById("emailInput").value = "";
            /*alert("Certificate Downloaded");
            console.log('email is valid');
          }else {
            console.log('The provided email does not exist or is not deliverable.');
            alert("Please give valid Email adress");
          }
      }
      });*/
      } else {
        console.log("He was too shy to give his first/last name");
        alert("Please d'ont be shy and supply us with your infos 🥺");
      }
  });


});

