export declare class LockingService {
    private readonly logger;
    private locks;
    acquireLock(skus: string[], ttlSeconds?: number): Promise<boolean>;
    releaseLock(skus: string[]): Promise<void>;
}
