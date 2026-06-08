const axios = require("axios");
const pdfParse = require("pdf-parse");
const Chunk = require("./models/Chunk");
const mongoose = require("mongoose");

// --------------------
// FETCH FILE
// --------------------
const getBuffer = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
};

// --------------------
// EXTRACT TEXT
// --------------------
const extractText = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

// --------------------
// CHUNKING
// --------------------
const chunkText = (text, maxLen = 500) => {
  const sentences = text.split(". ");

  const chunks = [];
  const seen = new Set();

  let current = "";

  for (let s of sentences) {
    const sentence = s.trim();

    if (!sentence) continue;

    if ((current + sentence).length > maxLen) {
      const finalChunk = current.trim();

      if (finalChunk && !seen.has(finalChunk)) {
        chunks.push(finalChunk);
        seen.add(finalChunk);
      }

      current = sentence;
    } else {
      current += (current ? ". " : "") + sentence;
    }
  }

  const last = current.trim();
  if (last && !seen.has(last)) {
    chunks.push(last);
  }

  return chunks;
};

// --------------------
// EMBEDDING
// --------------------
const getEmbedding = async (text) => {
  const res = await axios.post("http://localhost:8000/embed", {
    text,
  });

  return res.data.embedding;
};

// --------------------
// INGEST
// --------------------
const ingest = async (document) => {
  try {
    console.log("STEP 1: document", document._id);
    console.log("STEP 2: fileUrl", document.fileUrl);

    const buffer = await getBuffer(document.fileUrl);
    console.log("STEP 3: PDF downloaded");

    const text = await extractText(buffer);
    console.log("STEP 4: text extracted", text.length);

    const chunks = chunkText(text);
    console.log("STEP 5: chunks", chunks.length);

    const embeddings = await Promise.all(
      chunks.map((c) => getEmbedding(c))
    );
    console.log("STEP 6: embeddings done");

    const docs = chunks.map((c, i) => ({
      documentId: document._id,
      text: c,
      embedding: embeddings[i],
      chunkIndex: i,
    }));

    await Chunk.insertMany(docs);
    console.log("STEP 7: saved to DB");

    return chunks.length;

  } catch (err) {
    console.error("🔥 INGEST FAILED FULL ERROR:", err);
    throw err;
  }
};

// --------------------
// QUERY (RAG)
// --------------------
const query = async (question, documentId) => {
  if (!documentId) throw new Error("documentId is required");

  const queryEmbedding = await getEmbedding(question);

  const results = await Chunk.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      queryVector: queryEmbedding,
      path: "embedding",
      numCandidates: 100,
      limit: 5,
      filter: {
        documentId: new mongoose.Types.ObjectId(documentId)
      }
    },
  },
]);

  if (!results.length) {
    return {
      answer: "No relevant information found in this document.",
      sources: [],
    };
  }

  const context = results.map((r) => r.text).join("\n");

  const llmRes = await axios.post("http://localhost:8000/ask", {
    question,
    context,
  });

  return {
    answer: llmRes.data.answer,
    sources: results,
  };
};

module.exports = { ingest, query };