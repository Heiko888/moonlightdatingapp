import express, { Request, Response } from 'express';
import { geocodingService } from '../services/geocodingService';

const router = express.Router();

/**
 * POST /geocoding/lookup - Geocoding für einen Geburtsort
 */
router.post('/lookup', async (req: Request, res: Response) => {
  try {
    const { birthPlace } = req.body;

    if (!birthPlace || typeof birthPlace !== 'string') {
      return res.status(400).json({ 
        error: 'Geburtsort ist erforderlich',
        example: { birthPlace: 'Berlin, Deutschland' }
      });
    }

    console.log(`🌍 Geocoding-Request für: ${birthPlace}`);

    const result = await geocodingService.geocodeBirthPlace(birthPlace);

    res.json({
      success: true,
      geocoding: result,
      message: `Geocoding erfolgreich für: ${birthPlace}`
    });

  } catch (error) {
    console.error('❌ Geocoding-Fehler:', error);
    res.status(500).json({ 
      error: 'Geocoding fehlgeschlagen',
      message: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /geocoding/batch - Batch-Geocoding für mehrere Orte
 */
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { birthPlaces } = req.body;

    if (!Array.isArray(birthPlaces) || birthPlaces.length === 0) {
      return res.status(400).json({ 
        error: 'Array von Geburtsorten ist erforderlich',
        example: { birthPlaces: ['Berlin, Deutschland', 'Hamburg, Deutschland'] }
      });
    }

    if (birthPlaces.length > 10) {
      return res.status(400).json({ 
        error: 'Maximal 10 Geburtsorte pro Batch-Request erlaubt'
      });
    }

    console.log(`🌍 Batch-Geocoding für ${birthPlaces.length} Orte`);

    const results = await Promise.allSettled(
      birthPlaces.map(place => geocodingService.geocodeBirthPlace(place))
    );

    const successful = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    const failed = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result, index) => ({
        birthPlace: birthPlaces[index],
        error: result.reason.message
      }));

    res.json({
      success: true,
      results: {
        successful,
        failed,
        total: birthPlaces.length,
        successRate: `${successful.length}/${birthPlaces.length}`
      },
      message: `Batch-Geocoding abgeschlossen: ${successful.length} erfolgreich, ${failed.length} fehlgeschlagen`
    });

  } catch (error) {
    console.error('❌ Batch-Geocoding-Fehler:', error);
    res.status(500).json({ 
      error: 'Batch-Geocoding fehlgeschlagen',
      message: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * GET /geocoding/cache - Cache-Statistiken
 */
router.get('/cache', (req: Request, res: Response) => {
  try {
    const stats = geocodingService.getCacheStats();
    
    res.json({
      success: true,
      cache: stats,
      message: `Cache enthält ${stats.size} Einträge`
    });

  } catch (error) {
    console.error('❌ Cache-Statistik-Fehler:', error);
    res.status(500).json({ 
      error: 'Fehler beim Abrufen der Cache-Statistiken',
      message: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * DELETE /geocoding/cache - Cache leeren
 */
router.delete('/cache', (req: Request, res: Response) => {
  try {
    geocodingService.clearCache();
    
    res.json({
      success: true,
      message: 'Geocoding-Cache erfolgreich geleert'
    });

  } catch (error) {
    console.error('❌ Cache-Lösch-Fehler:', error);
    res.status(500).json({ 
      error: 'Fehler beim Leeren des Caches',
      message: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * GET /geocoding/test - Test verschiedene Geburtsorte
 */
router.get('/test', async (req: Request, res: Response) => {
  try {
    const testPlaces = [
      'Berlin, Deutschland',
      'Hamburg, Deutschland',
      'München, Deutschland',
      'Wien, Österreich',
      'Zürich, Schweiz',
      'Paris, Frankreich',
      'London, UK',
      'New York, USA',
      'Tokyo, Japan',
      'Sydney, Australien'
    ];

    console.log(`🧪 Geocoding-Test für ${testPlaces.length} Test-Orte`);

    const results = await Promise.allSettled(
      testPlaces.map(place => geocodingService.geocodeBirthPlace(place))
    );

    const testResults = results.map((result, index) => ({
      birthPlace: testPlaces[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));

    const successCount = testResults.filter(r => r.success).length;

    res.json({
      success: true,
      testResults,
      summary: {
        total: testPlaces.length,
        successful: successCount,
        failed: testPlaces.length - successCount,
        successRate: `${successCount}/${testPlaces.length} (${Math.round(successCount/testPlaces.length*100)}%)`
      },
      message: `Geocoding-Test abgeschlossen: ${successCount}/${testPlaces.length} erfolgreich`
    });

  } catch (error) {
    console.error('❌ Geocoding-Test-Fehler:', error);
    res.status(500).json({ 
      error: 'Geocoding-Test fehlgeschlagen',
      message: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

export default router;


