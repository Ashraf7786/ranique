import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LockingService {
  private readonly logger = new Logger(LockingService.name);
  
  // In-memory Mutex Map to simulate Redis Redlock
  // Key = product_sku, Value = boolean (isLocked)
  private locks: Map<string, boolean> = new Map();

  /**
   * Simulates acquiring a distributed lock on specific inventory SKUs before checkout.
   * If Redis was available, this would use `ioredis-lock`.
   */
  async acquireLock(skus: string[], ttlSeconds: number = 5): Promise<boolean> {
    for (const sku of skus) {
      if (this.locks.get(sku)) {
        this.logger.warn(`Could not acquire lock for SKU: ${sku} - already locked.`);
        return false;
      }
    }

    // Acquire locks
    for (const sku of skus) {
      this.locks.set(sku, true);
      this.logger.log(`Lock acquired for SKU: ${sku}`);
      
      // Auto-release the lock after TTL (simulating Redis key expiry)
      setTimeout(() => {
        if (this.locks.get(sku)) {
          this.locks.delete(sku);
          this.logger.debug(`Lock auto-released for SKU: ${sku} after TTL`);
        }
      }, ttlSeconds * 1000);
    }

    return true;
  }

  /**
   * Release the locks manually after successful transaction
   */
  async releaseLock(skus: string[]): Promise<void> {
    for (const sku of skus) {
      this.locks.delete(sku);
      this.logger.log(`Lock released manually for SKU: ${sku}`);
    }
  }
}
