export default async function useSleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}