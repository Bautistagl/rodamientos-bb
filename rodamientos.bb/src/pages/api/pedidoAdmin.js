const nodemailer = require('nodemailer');

async function pedidoAdmin(req, res) {
  const { method, body } = req;

  let mensajeHtml = `
  <html>
  <head>
    <title>Formulario Nippon</title>
  </head>
  <body>
    <h2>Estimado,</h2>
    <h3>Productos en el carrito:</h3>
    <ul>
      ${body.carrito
        .map(
          (item) => `
        <li>
          <strong>No Art: ${item.codigo1}</strong> <br>
          <strong>Marca: ${item.marca}</strong> <br>
          <strong>Precio: ${item.precio}</strong> <br>
          <strong>Cantidad:${item.cantidad}</strong> 
        </li>
      `
        )
        .join('')}
    </ul>
    <p>Comentario del cliente: ${body.comentario || 'N/A'}</p>
    <strong> Total de la compra : ${body.total}</strong>
  </body>
</html>`;

  switch (method) {
    case 'POST': {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bautistagonzalezlazo@gmail.com',
          pass: 'oljn jtul nsul cubz',
        },
      });

      const mailOptions = {
        from: 'Rodamientosbb',
        to: 'bautistagonzalezlazo@gmail.com',
        subject: 'Nuevo pedido',
        text: '',
        html: mensajeHtml,
      };

      try {
        await transporter.sendMail(mailOptions);

        res.status(200).send({
          email: null,
          nick_name: null,
          id: '1',
          message: 'Correo enviado exitosamente',
        });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error);
      }
    }
  }
}

export default pedidoAdmin;
