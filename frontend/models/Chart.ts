import { Schema, model, models } from 'mongoose';

const ChartSchema = new Schema({
  name: String,
  birthDate: String,
  birthTime: String,
  birthPlace: String,
  // das berechnete Chart (Typ, Zentren, Tore, Kanäle, Planeten ...)
  data: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default models.Chart || model('Chart', ChartSchema);



