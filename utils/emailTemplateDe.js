const emailTemplateDe = (body) => `
<!DOCTYPE html>
<html>
  <body style="
    margin: 0;
    padding: 0;
    background-color: #f6f0ef;
    font-family: Arial, Helvetica, sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 30px;">
          
          <!-- Contenedor -->
          <table width="600" cellpadding="0" cellspacing="0" style="
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
          ">
            <tr>
              <td style="
                background: linear-gradient(135deg, #ffd6d6, #d6c9ff);
                border-radius: 6px;
                padding: 60px 40px;
                text-align: center;
                color: #333333;
                font-size: 16px;
              ">
                ${body}
              </td>
            </tr>

            <!-- Firma -->
            <tr>
              <td style="
                padding-top: 20px;
                text-align: center;
                font-size: 16px;
                color: #ff6e5a;
                font-style: italic;
              ">
                Hebamme Marion
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = emailTemplateDe;