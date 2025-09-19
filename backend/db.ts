import User from './models/User';
import JournalEntry from './models/journal';
import Reading from './models/reading';
import Chart from './models/chart';
import KnowledgeItem from './models/knowledgeItem';
import Admin from './models/admin';

export async function getDataForAnalysis() {
  // Holt alle Daten aus den wichtigsten Modellen
  const users = await User.find();
  const journals = await JournalEntry.find();
  const readings = await Reading.find();
  const charts = await Chart.find();
  const knowledge = await KnowledgeItem.find();
  const admins = await Admin.find();
  return { users, journals, readings, charts, knowledge, admins };
}
