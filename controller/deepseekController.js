const axios = require("axios");

const translate = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: `Pretende que eres un traductor profesional, traduce al idioma Alemán manteniendo el formato original del contenido, estilo y tono. 
                      No agregues comentarios ni explicaciones, solo devuelve la traducción. Los values de los campos 'image' y 'video' no deben ser traducidos.`,
          },
          {
            role: "user",
            content:  JSON.stringify(text),
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    console.log(response.data.choices[0]?.message?.content, 'Repuesta DeepSeek');
    

    res.status(200).json({ 
        status: "success",
        data: response.data.choices[0]?.message?.content });
  } catch (error) {
    console.error("DeepSeek translation error:", error);
    res.status(500).json({ 
        status: "failure",
        message: "Error en la traducción" });
  }
};

module.exports = {
    translate
}
