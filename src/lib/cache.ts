// import { createClient } from '@supabase/supabase-js';
import { APIOutput } from '../types';
import * as fs from 'fs';
import * as path from 'path';
// const SUPABASE_URL = 'https://iqdsdnumpussaltfrvgb.supabase.co';

// const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY!);

interface CacheRecord extends APIOutput {
  url: string;
}

async function getCachedFiles() {
}

const checkForCache = async (url: string): Promise<APIOutput | null> => {
  try {
    const cache_path = path.resolve(__dirname, '../../cache');
    if (!fs.existsSync(cache_path)) {
      await fs.promises.mkdir(cache_path);
    }

    const file_name = url.match(/([\d\w.]*[\d\w]+\.[\d\w]+[.\d\w]*)/g)?.[0] || '_.'
    const file_path = path.join(cache_path, file_name)

    console.log('search for', url, 'in', file_name)
    if (file_name && fs.existsSync(file_path)) {
      const data = JSON.parse(String(fs.readFileSync(file_path)))[url];

      if (data) {
        return JSON.parse(data) as unknown as APIOutput;
      }

    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createCache = async (data: CacheRecord): Promise<boolean> => {
  try {
    const cache_path = path.resolve(__dirname, '../../cache');
    if (!fs.existsSync(cache_path)) {
      await fs.promises.mkdir(cache_path);
    }
    let cache_file = data.url.match(/([\d\w.]*[\d\w]+\.[\d\w]+[.\d\w]*)/g)?.[0];
    if (!cache_file) {
      return false;
    }

    cache_file = path.join(cache_path, cache_file);

    await fs.promises.writeFile(
      cache_file,
      JSON.stringify({
        [data.url]: JSON.stringify(data),
      }),
      {
        flag: 'w',
      }
    );
    if (fs.existsSync(cache_file)) {
      const domain_repository = JSON.parse(String(fs.readFileSync(cache_file)));
      await fs.promises.writeFile(
        cache_file,
        JSON.stringify({
          ...domain_repository,
          [data.url]: JSON.stringify(data),
        })
      );
    } else {
      await fs.promises.writeFile(
        cache_file,
        JSON.stringify({
          [data.url]: JSON.stringify(data),
        })
      );
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { checkForCache, createCache };
