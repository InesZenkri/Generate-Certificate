document.addEventListener("DOMContentLoaded", function () {
  const certificateForm = document.getElementById("certificateForm");

  const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const generatePDF = async (firstName, lastName) => {
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
    const fullName = `${formattedFirstName} ${formattedLastName}`;

    /*Draw name on the certificate
    but i still need find the right x cordinates inorder to place the name in the correct postion "center"*/
    const startX = 135; 
    const endX = 740; 
    const rangeWidth = endX - startX;
    let fontSize = 58; //initial 
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    let textWidth = font.widthOfTextAtSize(fullName, fontSize);
    console.log(textWidth);
    console.log(rangeWidth);
    console.log(fontSize);
    if(textWidth > rangeWidth) {
      console.log("doesn't fit in");
      const scale = rangeWidth / textWidth;
      fontSize *= scale ;
      textWidth = font.widthOfTextAtSize(fullName, fontSize);
      console.log(textWidth);
      console.log(fontSize);
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
    saveAs(file, "Certificate.pdf");
  };

  certificateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstNameInput").value.trim();
    const lastName = document.getElementById("lastNameInput").value.trim();
    if (firstName !== "" && lastName !== "") {
      generatePDF(firstName, lastName);
      document.getElementById("firstNameInput").value = "";
      document.getElementById("lastNameInput").value = "";
      document.getElementById("emailInput").value = "";
      alert("Certificate Downloaded");
    } else {
      console.log("He was too shy to give his first/last name");
      alert("Please d'ont be shy and supply us with your infos 🥺");
    }
  });
});

