import { Schema, model, models } from 'mongoose';

const KnowledgeItemSchema = new Schema({
  category: { type: String, index: true }, // z.B. "Typen", "Zentren", "Tore", "Kanäle", "Profile", "Planeten"
  slug:     { type: String, index: true }, // z.B. "generator", "sakral", "34-20"
  title:    String,
  body:     String
}, { timestamps: true });

export default models.KnowledgeItem || model('KnowledgeItem', KnowledgeItemSchema);

