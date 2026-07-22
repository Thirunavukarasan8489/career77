# Career77 — Security Threat Model: Saved Jobs

*   **Threat**: Session ID tampering.
    *   **Risk**: High.
    *   **Mitigation**: Session tokens are cryptographically signed.
*   **Threat**: ID tampering (updating another user's saves).
    *   **Risk**: High.
    *   **Mitigation**: The update queries use candidate IDs populated from the decrypted session rather than body parameters.
*   **Threat**: Database spamming (saving millions of jobs).
    *   **Risk**: Medium.
    *   **Mitigation**: Restrict `savedJobs` array lengths to 50 active items.
