import "server-only";
import { connect } from "node:net";

/** True when something accepts a TCP connection on host:port within the timeout. */
export function isReachable(host: string, port: number, timeoutMs = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host, port, timeout: timeoutMs });
    const finish = (result: boolean) => {
      socket.destroy();
      resolve(result);
    };
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}
