import redis from 'redis';
import { promisify } from 'util';
import colors from 'colors';

const Redis_port = parseInt(`${process.env.REDIS_PORT}`) || 6379

const client = redis.createClient(Redis_port)

client.on('connect', () => {
  console.log(colors.cyan("Redis connected Successfully !.."))
})

client.on('error', (err) => {
  console.log(colors.red("Redis ERROR !.."))
  // console.table(err)
})


export const getClientAsync = promisify(client.get).bind(client) // : (arg1: string) => Promise<string | null>
export const setClientAsync = promisify(client.set).bind(client)
export const setExpClientAsync = promisify(client.SETEX).bind(client)
export const existsClientAsync = promisify(client.EXISTS).bind(client)
// export const delClientAsync = promisify(client.DEL).bind(client)
export function delClientAsync(key: string) {
    return new Promise((resv, rej) => {
      client.del(key, (err, reply) => {
        resv(1);
      });
    })
  }

export default client;