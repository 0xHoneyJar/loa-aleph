import assert from 'node:assert/strict';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { digest, json, type Json } from './common.ts';
import { verifyGuard, verifyOwnership } from './service.ts';
import { alive, disposition, requireBudget, tick, verifyPhases } from './supervisor.ts';

/** Harmless service tests only. A guard result is not a terminal receipt. */
export async function waitForGuardTerminal(root: string, deadline: number, deadlineTick: bigint):
Promise<{ result: Json; terminal: Json }> {
  const checkDeadline = (): void => {
    assert(Date.now() < deadline && process.hrtime.bigint() < deadlineTick, 'GUARD_SERVICE_TEST_DEADLINE');
  };
  const complete = (): boolean => existsSync(join(root, 'guard-result.json')) && existsSync(join(root, 'terminal.json'));
  const retained = (name: string): Json => {
    const path = join(root, name), stat = lstatSync(path);
    assert(stat.isFile() && !stat.isSymbolicLink() && !(stat.mode & 0o222), `TERMINAL_CUSTODY ${name}`);
    return json(path);
  };
  const hash = (name: string): string => digest(readFileSync(join(root, name)));
  for (;;) {
    checkDeadline();
    if (complete()) {
      const owner = verifyOwnership(root);
      verifyGuard(root);
      const result = retained('guard-result.json'), terminal = retained('terminal.json');
      assert.equal(result.verdict, terminal.verdict, 'GUARD_TERMINAL_VERDICT');
      assert(['PASS', 'FAIL', 'TIMEOUT', 'INTERRUPTED'].includes(terminal.verdict), 'TERMINAL_VERDICT');
      assert.equal(result.ownership_digest, owner.digest, 'GUARD_OWNER');
      assert.equal(terminal.ownership_digest, owner.digest, 'TERMINAL_OWNER');
      assert.equal(result.guard_digest, hash('guard.json'), 'GUARD_DIGEST');
      if (terminal.verdict === 'PASS') {
        const completion = retained('completion.json');
        assert.equal(disposition(root), 'PASS', 'UNAUTHENTICATED_TERMINAL');
        assert.equal(completion.verdict, 'PASS');
        assert.equal(completion.ownership_digest, owner.digest);
        assert.equal(completion.verification, 'synthetic-service-only-no-C1');
        assert.equal(terminal.verification, completion.verification);
        assert(completion.finished_at <= terminal.finished_at);
        assert(tick(completion.finished_tick) <= tick(terminal.finished_tick));
        verifyPhases(root, completion.finished_at, completion.finished_tick);
        requireBudget(root);
      } else {
        assert.equal(result.terminal_digest, hash('terminal.json'), 'TERMINAL_DIGEST');
      }
      checkDeadline();
      return { result, terminal };
    }
    if (existsSync(join(root, 'guard.json'))) {
      const guard = verifyGuard(root);
      if (!alive(guard.identity)) {
        // The guard may have published the terminal immediately before exiting.
        if (complete()) continue;
        assert.fail('GUARD_EXIT_BEFORE_TERMINAL');
      }
    }
    if (existsSync(join(root, 'driver.json'))) {
      const owner = verifyOwnership(root);
      if (!alive(owner.driver.identity)) {
        if (complete()) continue;
        assert.fail('DRIVER_EXIT_BEFORE_TERMINAL');
      }
    }
    checkDeadline();
    await new Promise(done => setTimeout(done, 25));
  }
}
