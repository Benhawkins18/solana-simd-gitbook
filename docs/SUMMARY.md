# Summary
* [SIMDs Overview](README.md)
## Accepted SIMDs
  * Accepted
    * [SIMD-0009 - Lockout Violation Detection](accepted/Accepted/SIMD-0009.md)
    * [SIMD-0022 - Multi Delegation Stake Account](accepted/Accepted/SIMD-0022.md)
    * [SIMD-0075 - Precompile for verifying secp256r1 sig.](accepted/Accepted/SIMD-0075.md)
    * [SIMD-0083 - Relax Entry Constraints](accepted/Accepted/SIMD-0083.md)
    * [SIMD-0088 - Enable Core BPF Programs](accepted/Accepted/SIMD-0088.md)
    * [SIMD-0089 - Programify Feature Gate Program](accepted/Accepted/SIMD-0089.md)
    * [SIMD-0105 - Maintain Dynamic Set of Reserved Account Keys](accepted/Accepted/SIMD-0105.md)
    * [SIMD-0118 - Partitioned Epoch Rewards Distribution](accepted/Accepted/SIMD-0118.md)
    * [SIMD-0127 - Get-Sysvar Syscall](accepted/Accepted/SIMD-0127.md)
    * [SIMD-0128 - Migrate Address Lookup Table to Core BPF](accepted/Accepted/SIMD-0128.md)
    * [SIMD-0137 - EC Syscalls - Abort on Unsupported Curve/Ops](accepted/Accepted/SIMD-0137.md)
    * [SIMD-0138 - Deprecate legacy vote instructions](accepted/Accepted/SIMD-0138.md)
    * [SIMD-0140 - Migrate Config to Core BPF](accepted/Accepted/SIMD-0140.md)
    * [SIMD-0149 - Migrate Snapshot Serialized Epoch Stakes](accepted/Accepted/SIMD-0149.md)
    * [SIMD-0152 - Precompiles](accepted/Accepted/SIMD-0152.md)
    * [SIMD-0153 - ZK ElGamal Proof Program](accepted/Accepted/SIMD-0153.md)
    * [SIMD-0162 - Remove Accounts `is_executable` Flag Checks](accepted/Accepted/SIMD-0162.md)
    * [SIMD-0163 - Lift the CPI caller restriction](accepted/Accepted/SIMD-0163.md)
    * [SIMD-0175 - Disable Partitioned Rent Updates](accepted/Accepted/SIMD-0175.md)
    * [SIMD-0183 - Skip Rent Rewrites](accepted/Accepted/SIMD-0183.md)
    * [SIMD-0207 - Raise Block Limits to 50M CUs](accepted/Accepted/SIMD-0207.md)
    * [SIMD-0215 - Homomorphic Hashing of Account State](accepted/Accepted/SIMD-0215.md)
    * [SIMD-0223 - Removes Accounts Delta Hash](accepted/Accepted/SIMD-0223.md)
  * Activated
    * [SIMD-0033 - Timely Vote Credits](accepted/Activated/SIMD-0033.md)
    * [SIMD-0085 - Additional Fee-Collector Constraints](accepted/Activated/SIMD-0085.md)
    * [SIMD-0093 - Disable Bpf loader V2 program deployment](accepted/Activated/SIMD-0093.md)
    * [SIMD-0129 - Alt_BN128 Syscalls - Simplified Error Code](accepted/Activated/SIMD-0129.md)
  * Draft
    * [SIMD-0159 - Relax Precompile Failure Constraint](accepted/Draft/SIMD-0159.md)
  * Implemented
    * [SIMD-0046 - Optimistic cluster restart automation](accepted/Implemented/SIMD-0046.md)
    * [SIMD-0047 - Syscall and Sysvar for last restart slot](accepted/Implemented/SIMD-0047.md)
    * [SIMD-0049 - Syscall for remaining compute units](accepted/Implemented/SIMD-0049.md)
    * [SIMD-0079 - Allow Commission Decrease at Any Time](accepted/Implemented/SIMD-0079.md)
    * [SIMD-0084 - Disable rent fees collection](accepted/Implemented/SIMD-0084.md)
    * [SIMD-0096 - Reward full priority fee to validator](accepted/Implemented/SIMD-0096.md)
    * [SIMD-0133 - Syscall Get-Epoch-Stake](accepted/Implemented/SIMD-0133.md)
    * [SIMD-0148 - MoveStake and MoveLamports Instructions](accepted/Implemented/SIMD-0148.md)
  * Living
    * [SIMD-0001 - Solana Proposal Process](accepted/Living/SIMD-0001.md)
    * [SIMD-0007 - SIMD Access Policy](accepted/Living/SIMD-0007.md)
  * Review
    * [SIMD-0170 - Reserve minimal CUs for builtins](accepted/Review/SIMD-0170.md)
    * [SIMD-0182 - Consume requested CUs for sBPF failures](accepted/Review/SIMD-0182.md)
    * [SIMD-0186 - Loaded Transaction Data Size Specification](accepted/Review/SIMD-0186.md)
    * [SIMD-0196 - Migrate Stake to Core BPF](accepted/Review/SIMD-0196.md)
    * [SIMD-0220 - Snapshots use Accounts Lattice Hash](accepted/Review/SIMD-0220.md)
    * [SIMD-0222 - Fix alt-bn128 multiplication syscall length](accepted/Review/SIMD-0222.md)
  * Stagnant
    * [SIMD-0064 - Transaction Receipts](accepted/Stagnant/SIMD-0064.md)
  * Withdrawn
    * [SIMD-0015 - Partitioned Epoch Rewards Distribution](accepted/Withdrawn/SIMD-0015.md)
    * [SIMD-0048 - Native Program for verifying secp256r1 sig.](accepted/Withdrawn/SIMD-0048.md)
## Proposed SIMDs
  * PR #57
    * [SIMD-0057 - Events](proposed/PR-57/SIMD-0057.md)
  * PR #72
    * [SIMD-0072 - Feature Gate Threshold Automation](proposed/PR-72/SIMD-0072.md)
  * PR #94
    * [SIMD-0094 - Deprecate executable update in bpf loader](proposed/PR-94/SIMD-0094.md)
  * PR #95
    * [SIMD-0095 - extendable output (XOF) hashing support](proposed/PR-95/SIMD-0095.md)
  * PR #121
    * [SIMD-0120 - Guidance on compute cost estimation](proposed/PR-121/SIMD-0120.md)
  * PR #123
    * [SIMD-0123 - Block Revenue Sharing](proposed/PR-123/SIMD-0123.md)
  * PR #125
    * [SIMD-0125 - Incremental Accounts Hash](proposed/PR-125/SIMD-0125.md)
  * PR #132
    * [SIMD-0130 - Dynamic Block Limits](proposed/PR-132/SIMD-0130.md)
  * PR #160
    * [SIMD-0160 - Static Instruction Limit](proposed/PR-160/SIMD-0160.md)
  * PR #161
    * [SIMD-0161 - SBPF versioning and feature gating](proposed/PR-161/SIMD-0161.md)
  * PR #165
    * [SIMD-0165 - Async Vote Execution](proposed/PR-165/SIMD-0165.md)
  * PR #166
    * [SIMD-0166 - SBPF Dynamic stack frames](proposed/PR-166/SIMD-0166.md)
  * PR #167
    * [SIMD-0167 - Loader-v4](proposed/PR-167/SIMD-0167.md)
  * PR #171
    * [SIMD-0118 - Partitioned Epoch Rewards Distribution](proposed/PR-171/SIMD-0118.md)
  * PR #172
    * [SIMD-0172 - Reduce default CU per instruction to zero](proposed/PR-172/SIMD-0172.md)
  * PR #173
    * [SIMD-0173 - SBPF instruction encoding improvements](proposed/PR-173/SIMD-0173.md)
  * PR #174
    * [SIMD-0174 - SBPF arithmetics improvements](proposed/PR-174/SIMD-0174.md)
  * PR #177
    * [SIMD-0177 - Program Runtime ABI v2](proposed/PR-177/SIMD-0177.md)
  * PR #178
    * [SIMD-0178 - SBPF Static Syscalls](proposed/PR-178/SIMD-0178.md)
  * PR #179
    * [SIMD-0179 - SBPF Stricter verification constraints](proposed/PR-179/SIMD-0179.md)
  * PR #180
    * [SIMD-0180 - Leader Schedule Migration](proposed/PR-180/SIMD-0180.md)
  * PR #184
    * [SIMD-0184 - Block Writeable Account Data Limit](proposed/PR-184/SIMD-0184.md)
  * PR #185
    * [SIMD-0185 - Vote Account v4](proposed/PR-185/SIMD-0185.md)
  * PR #189
    * [SIMD-0189 - SBPF stricter ELF headers](proposed/PR-189/SIMD-0189.md)
  * PR #191
    * [SIMD-0191 - Relax Transaction Loading Constraints](proposed/PR-191/SIMD-0191.md)
  * PR #192
    * [SIMD-0192 - Relax Transaction Account Resolution](proposed/PR-192/SIMD-0192.md)
  * PR #193
    * [SIMD-0133 - Syscall Get-Epoch-Stake](proposed/PR-193/SIMD-0133.md)
  * PR #194
    * [SIMD-0194 - Deprecate Rent Exemption Threshold](proposed/PR-194/SIMD-0194.md)
  * PR #195
    * [SIMD-0195 - TPU Vote using QUIC](proposed/PR-195/SIMD-0195.md)
  * PR #197
    * [SIMD-0197 - Chili Peppers](proposed/PR-197/SIMD-0197.md)
  * PR #198
    * [SIMD-0198 - Define CUs for Builtin instructions](proposed/PR-198/SIMD-0198.md)
  * PR #201
    * [SIMD-0201 - Create Cluster Sysvar](proposed/PR-201/SIMD-0201.md)
  * PR #204
    * [SIMD-0204 - Slashable event verification](proposed/PR-204/SIMD-0204.md)
  * PR #212
    * [SIMD-0212 - Slashing](proposed/PR-212/SIMD-0212.md)
  * PR #217
    * [SIMD-0218 - Intermediate vote credits](proposed/PR-217/SIMD-0218.md)
  * PR #219
    * [SIMD-0219 - Stricter VM verification constraints](proposed/PR-219/SIMD-0219.md)
  * PR #230
    * [SIMD-0175 - Disable Partitioned Rent Updates](proposed/PR-230/SIMD-0175.md)
  * PR #231
    * [SIMD-0175 - Disable Partitioned Rent Updates](proposed/PR-231/SIMD-0175.md)
    * [SIMD-0231 - Disable Account Rent Epoch Updates](proposed/PR-231/SIMD-0231.md)
  * PR #232
    * [SIMD-0232 - Custom Fee Collector Account](proposed/PR-232/SIMD-0232.md)
  * PR #233
    * [SIMD-0159 - Relax Precompile Failure Constraint](proposed/PR-233/SIMD-0159.md)