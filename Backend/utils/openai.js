import "dotenv/config";

const getOpenAIAPIResponse = async(message) => {
    const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options,
    );
    const data = await response.json();

    return data.choices[0].message.content;
    
    // console.log("Full Response:", data);

    // if (data.choices && data.choices[0]) {
    //     console.log(data.choices[0].message.content);
    //     res.send(data.choices[0].message.content);
    // } else {
    //     console.log("Error from API:", data);
    //     res.status(500).send("API Error: " + JSON.stringify(data));
    // }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred");
  }
}

export default getOpenAIAPIResponse;