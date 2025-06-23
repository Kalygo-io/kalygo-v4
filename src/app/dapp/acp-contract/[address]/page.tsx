"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { type Address, parseEther, formatEther } from 'viem';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ACPArtifact from '../../../../contracts/ACP.json';

interface ACPContractState {
  platformFee: string;
  platformOwner: string;
}

interface Job {
  id: string;
  requester: string;
  provider: string;
  budget: string;
  escrowAmount: string;
  amountReleased: string;
  phase: number;
  memoCount: string;
  evaluatorCount: number;
  requiredApprovals: number;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
}

interface Memo {
  id: string;
  jobId: string;
  sender: string;
  memoType: number;
  content: string;
  url: string;
  verificationHash: string;
  requestedPhase: number;
  numApprovals: number;
  numRejections: number;
  isSecured: boolean;
  createdAt: string;
  isPhaseTransition: boolean;
}

const ACPContractDetailsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contractState, setContractState] = useState<ACPContractState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobMemos, setJobMemos] = useState<Memo[]>([]);
  const [jobEvaluators, setJobEvaluators] = useState<string[]>([]);
  
  // Form states
  const [newJobForm, setNewJobForm] = useState({
    provider: '',
    budget: '',
    requiredApprovals: '1',
    expiresAt: '',
  });
  const [newMemoForm, setNewMemoForm] = useState({
    content: '',
    url: '',
    verificationHash: '',
    requestedPhase: '0',
    isSecured: false,
  });
  const [newEvaluator, setNewEvaluator] = useState('');
  const [newPlatformFee, setNewPlatformFee] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [memoSignForm, setMemoSignForm] = useState({
    memoId: '',
    isApproved: true,
    reason: '',
  });
  
  const params = useParams();
  const contractAddress = params.address as string;
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const loadContractState = useCallback(async () => {
    if (!publicClient || !contractAddress) {
      setError('No public client or contract address available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [platformFee, platformOwner] = await Promise.all([
        publicClient.readContract({
          address: contractAddress as Address,
          abi: ACPArtifact.abi,
          functionName: 'platformFee',
        }),
        publicClient.readContract({
          address: contractAddress as Address,
          abi: ACPArtifact.abi,
          functionName: 'platformOwner',
        }),
      ]);

      setContractState({
        platformFee: (platformFee as bigint).toString(),
        platformOwner: platformOwner as string,
      });
    } catch (err) {
      console.error('Failed to load ACP contract state:', err);
      setError('Failed to load contract details');
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, contractAddress]);

  useEffect(() => {
    loadContractState();
  }, [loadContractState]);

  const loadUserJobs = async () => {
    if (!publicClient || !address) return;

    try {
      // Get user's job count and load jobs
      const userJobCount = await publicClient.readContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'userJobs',
        args: [address as Address, BigInt(0)],
      }) as bigint;

      const jobsData: Job[] = [];
      for (let i = 0; i < Number(userJobCount); i++) {
        try {
          const jobId = await publicClient.readContract({
            address: contractAddress as Address,
            abi: ACPArtifact.abi,
            functionName: 'userJobs',
            args: [address as Address, BigInt(i)],
          }) as bigint;

          const job = await publicClient.readContract({
            address: contractAddress as Address,
            abi: ACPArtifact.abi,
            functionName: 'getJob',
            args: [jobId],
          }) as [bigint, string, string, bigint, bigint, bigint, number, bigint, number, number, bigint, bigint, bigint];

          jobsData.push({
            id: jobId.toString(),
            requester: job[1] as string,
            provider: job[2] as string,
            budget: (job[3] as bigint).toString(),
            escrowAmount: (job[4] as bigint).toString(),
            amountReleased: (job[5] as bigint).toString(),
            phase: Number(job[6]),
            memoCount: (job[7] as bigint).toString(),
            evaluatorCount: Number(job[8]),
            requiredApprovals: Number(job[9]),
            createdAt: (job[10] as bigint).toString(),
            expiresAt: (job[11] as bigint).toString(),
            lastActivityAt: (job[12] as bigint).toString(),
          });
        } catch (err) {
          console.warn(`Failed to load job ${i}:`, err);
        }
      }

      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to load user jobs:', err);
      toast.error('Failed to load jobs');
    }
  };

  const loadJobDetails = async (jobId: string) => {
    if (!publicClient) return;

    try {
      const [memos, evaluators] = await Promise.all([
        publicClient.readContract({
          address: contractAddress as Address,
          abi: ACPArtifact.abi,
          functionName: 'getJobMemos',
          args: [BigInt(jobId)],
        }),
        publicClient.readContract({
          address: contractAddress as Address,
          abi: ACPArtifact.abi,
          functionName: 'getJobEvaluators',
          args: [BigInt(jobId)],
        }),
      ]);

      setJobMemos(memos as Memo[]);
      setJobEvaluators(evaluators as string[]);
    } catch (err) {
      console.error('Failed to load job details:', err);
      toast.error('Failed to load job details');
    }
  };

  const createJob = async () => {
    if (!walletClient || !publicClient) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      const budget = parseEther(newJobForm.budget);
      const expiresAt = Math.floor(new Date(newJobForm.expiresAt).getTime() / 1000);
      const requiredApprovals = parseInt(newJobForm.requiredApprovals);

      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'createJob',
        args: [
          newJobForm.provider as Address,
          budget,
          requiredApprovals,
          BigInt(expiresAt),
        ],
        value: budget,
        account: address as Address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Job created successfully!');
      setNewJobForm({ provider: '', budget: '', requiredApprovals: '1', expiresAt: '' });
      loadUserJobs();
    } catch (err) {
      console.error('Failed to create job:', err);
      toast.error('Failed to create job');
    }
  };

  const createMemo = async () => {
    if (!walletClient || !publicClient || !selectedJob) {
      toast.error('Please select a job first');
      return;
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'createMemo',
        args: [
          BigInt(selectedJob.id),
          parseInt(newMemoForm.requestedPhase),
          newMemoForm.content,
          newMemoForm.url,
          newMemoForm.verificationHash as `0x${string}`,
          parseInt(newMemoForm.requestedPhase),
          newMemoForm.isSecured,
        ],
        account: address as Address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Memo created successfully!');
      setNewMemoForm({ content: '', url: '', verificationHash: '', requestedPhase: '0', isSecured: false });
      loadJobDetails(selectedJob.id);
    } catch (err) {
      console.error('Failed to create memo:', err);
      toast.error('Failed to create memo');
    }
  };

  const addEvaluator = async () => {
    if (!walletClient || !publicClient || !selectedJob) {
      toast.error('Please select a job first');
      return;
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'addEvaluator',
        args: [BigInt(selectedJob.id), newEvaluator as Address],
        account: address as Address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Evaluator added successfully!');
      setNewEvaluator('');
      loadJobDetails(selectedJob.id);
    } catch (err) {
      console.error('Failed to add evaluator:', err);
      toast.error('Failed to add evaluator');
    }
  };

  const signMemo = async () => {
    if (!walletClient || !publicClient) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'signMemo',
        args: [
          BigInt(memoSignForm.memoId),
          memoSignForm.isApproved,
          memoSignForm.reason,
        ],
        account: address as Address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Memo signed successfully!');
      setMemoSignForm({ memoId: '', isApproved: true, reason: '' });
      if (selectedJob) {
        loadJobDetails(selectedJob.id);
      }
    } catch (err) {
      console.error('Failed to sign memo:', err);
      toast.error('Failed to sign memo');
    }
  };

  const updatePlatformFee = async () => {
    if (!walletClient || !publicClient) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      const newFee = parseEther(newPlatformFee);
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'updatePlatformFee',
        args: [newFee],
        account: address as Address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Platform fee updated successfully!');
      setNewPlatformFee('');
      loadContractState();
    } catch (err) {
      console.error('Failed to update platform fee:', err);
      toast.error('Failed to update platform fee');
    }
  };

  const transferOwnership = async () => {
    if (!walletClient || !publicClient) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'transferPlatformOwnership',
        args: [newOwner as Address],
        account: address as Address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Ownership transferred successfully!');
      setNewOwner('');
      loadContractState();
    } catch (err) {
      console.error('Failed to transfer ownership:', err);
      toast.error('Failed to transfer ownership');
    }
  };

  const cancelJob = async (jobId: string) => {
    if (!walletClient || !publicClient) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: ACPArtifact.abi,
        functionName: 'cancelJob',
        args: [BigInt(jobId)],
        account: address as Address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Job cancelled successfully!');
      loadUserJobs();
    } catch (err) {
      console.error('Failed to cancel job:', err);
      toast.error('Failed to cancel job');
    }
  };

  const getPhaseString = (phase: number) => {
    const phases = ['Created', 'In Progress', 'Review', 'Completed', 'Cancelled'];
    return phases[phase] || 'Unknown';
  };

  const getMemoTypeString = (type: number) => {
    const types = ['General', 'Milestone', 'Issue', 'Resolution', 'Approval'];
    return types[type] || 'Unknown';
  };

  const renderOverview = () => {
    if (!contractState) return null;

    const isPlatformOwner = address?.toLowerCase() === contractState.platformOwner.toLowerCase();

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="break-all">
              <p className="text-sm font-medium text-gray-500">Contract Address</p>
              <p className="text-md text-gray-900 font-mono">{contractAddress}</p>
            </div>
            <div className="break-all">
              <p className="text-sm font-medium text-gray-500">Platform Owner</p>
              <p className="text-md text-gray-900 font-mono">{contractState.platformOwner}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Platform Fee</p>
              <p className="text-md text-gray-900 font-mono">{formatEther(BigInt(contractState.platformFee))} ETH</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Your Role</p>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                isPlatformOwner 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isPlatformOwner ? 'Platform Owner' : 'User'}
              </span>
            </div>
          </div>
        </div>

        {isPlatformOwner && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Management</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Platform Fee (ETH)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={newPlatformFee}
                    onChange={(e) => setNewPlatformFee(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.01"
                  />
                  <button
                    onClick={updatePlatformFee}
                    disabled={!newPlatformFee}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    Update Fee
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Ownership
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0x..."
                  />
                  <button
                    onClick={transferOwnership}
                    disabled={!newOwner}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About ACP Contracts</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              ACP (Arbitration and Contract Platform) contracts provide a decentralized platform for managing 
              jobs, escrow, and arbitration processes.
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Job creation and management with escrow functionality</li>
              <li>Multi-phase job workflows with approval mechanisms</li>
              <li>Memo-based communication and documentation</li>
              <li>Arbitration and dispute resolution</li>
              <li>Platform fee collection and management</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderJobs = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Job</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider Address
              </label>
              <input
                type="text"
                value={newJobForm.provider}
                onChange={(e) => setNewJobForm({...newJobForm, provider: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                value={newJobForm.budget}
                onChange={(e) => setNewJobForm({...newJobForm, budget: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Approvals
              </label>
              <input
                type="number"
                min="1"
                value={newJobForm.requiredApprovals}
                onChange={(e) => setNewJobForm({...newJobForm, requiredApprovals: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires At
              </label>
              <input
                type="datetime-local"
                value={newJobForm.expiresAt}
                onChange={(e) => setNewJobForm({...newJobForm, expiresAt: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <button
            onClick={createJob}
            disabled={!newJobForm.provider || !newJobForm.budget || !newJobForm.expiresAt}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
          >
            Create Job
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Jobs</h3>
          <button
            onClick={loadUserJobs}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Jobs
          </button>
          
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs found. Create your first job above.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Job #{job.id}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.phase === 0 ? 'bg-blue-100 text-blue-800' :
                      job.phase === 1 ? 'bg-yellow-100 text-yellow-800' :
                      job.phase === 2 ? 'bg-purple-100 text-purple-800' :
                      job.phase === 3 ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getPhaseString(job.phase)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Provider</p>
                      <p className="font-mono break-all">{job.provider}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Budget</p>
                      <p>{formatEther(BigInt(job.budget))} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Escrow</p>
                      <p>{formatEther(BigInt(job.escrowAmount))} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Memos</p>
                      <p>{job.memoCount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        loadJobDetails(job.id);
                        setActiveTab('job-details');
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      View Details
                    </button>
                    {job.phase === 0 && (
                      <button
                        onClick={() => cancelJob(job.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderJobDetails = () => {
    if (!selectedJob) {
      return <p className="text-gray-500">No job selected. Please select a job from the Jobs tab.</p>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Job #{selectedJob.id} Details</h3>
            <button
              onClick={() => setActiveTab('jobs')}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Jobs
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Requester</p>
              <p className="font-mono break-all">{selectedJob.requester}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Provider</p>
              <p className="font-mono break-all">{selectedJob.provider}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p>{formatEther(BigInt(selectedJob.budget))} ETH</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Escrow Amount</p>
              <p>{formatEther(BigInt(selectedJob.escrowAmount))} ETH</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount Released</p>
              <p>{formatEther(BigInt(selectedJob.amountReleased))} ETH</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phase</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                selectedJob.phase === 0 ? 'bg-blue-100 text-blue-800' :
                selectedJob.phase === 1 ? 'bg-yellow-100 text-yellow-800' :
                selectedJob.phase === 2 ? 'bg-purple-100 text-purple-800' :
                selectedJob.phase === 3 ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {getPhaseString(selectedJob.phase)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Required Approvals</p>
              <p>{selectedJob.requiredApprovals}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Evaluators</p>
              <p>{selectedJob.evaluatorCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Evaluator</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newEvaluator}
              onChange={(e) => setNewEvaluator(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="0x..."
            />
            <button
              onClick={addEvaluator}
              disabled={!newEvaluator}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
            >
              Add Evaluator
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Evaluators</h4>
          {jobEvaluators.length === 0 ? (
            <p className="text-gray-500">No evaluators assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {jobEvaluators.map((evaluator, index) => (
                <div key={index} className="font-mono break-all text-sm">
                  {evaluator}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Create Memo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={newMemoForm.content}
                onChange={(e) => setNewMemoForm({...newMemoForm, content: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="Memo content..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (optional)
              </label>
              <input
                type="url"
                value={newMemoForm.url}
                onChange={(e) => setNewMemoForm({...newMemoForm, url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Hash (optional)
              </label>
              <input
                type="text"
                value={newMemoForm.verificationHash}
                onChange={(e) => setNewMemoForm({...newMemoForm, verificationHash: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Phase
              </label>
              <select
                value={newMemoForm.requestedPhase}
                onChange={(e) => setNewMemoForm({...newMemoForm, requestedPhase: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="0">Created</option>
                <option value="1">In Progress</option>
                <option value="2">Review</option>
                <option value="3">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="isSecured"
              checked={newMemoForm.isSecured}
              onChange={(e) => setNewMemoForm({...newMemoForm, isSecured: e.target.checked})}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="isSecured" className="text-sm text-gray-700">
              Secure memo (requires approval)
            </label>
          </div>
          <button
            onClick={createMemo}
            disabled={!newMemoForm.content}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
          >
            Create Memo
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Memos</h4>
          {jobMemos.length === 0 ? (
            <p className="text-gray-500">No memos found for this job.</p>
          ) : (
            <div className="space-y-4">
              {jobMemos.map((memo) => (
                <div key={memo.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold">Memo #{memo.id}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      memo.isSecured ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {memo.isSecured ? 'Secured' : 'Public'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Sender</p>
                      <p className="font-mono break-all">{memo.sender}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p>{getMemoTypeString(memo.memoType)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Approvals</p>
                      <p>{memo.numApprovals}/{selectedJob.requiredApprovals}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rejections</p>
                      <p>{memo.numRejections}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-gray-500 text-sm">Content</p>
                    <p className="text-sm">{memo.content}</p>
                  </div>
                  {memo.url && (
                    <div className="mb-3">
                      <p className="text-gray-500 text-sm">URL</p>
                      <a href={memo.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {memo.url}
                      </a>
                    </div>
                  )}
                  {memo.verificationHash && (
                    <div className="mb-3">
                      <p className="text-gray-500 text-sm">Verification Hash</p>
                      <p className="font-mono text-sm break-all">{memo.verificationHash}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Sign Memo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memo ID
              </label>
              <input
                type="number"
                value={memoSignForm.memoId}
                onChange={(e) => setMemoSignForm({...memoSignForm, memoId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <input
                type="text"
                value={memoSignForm.reason}
                onChange={(e) => setMemoSignForm({...memoSignForm, reason: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Reason for approval/rejection"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="approval"
                checked={memoSignForm.isApproved}
                onChange={() => setMemoSignForm({...memoSignForm, isApproved: true})}
                className="mr-2"
              />
              Approve
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="approval"
                checked={!memoSignForm.isApproved}
                onChange={() => setMemoSignForm({...memoSignForm, isApproved: false})}
                className="mr-2"
              />
              Reject
            </label>
          </div>
          <button
            onClick={signMemo}
            disabled={!memoSignForm.memoId}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
          >
            Sign Memo
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ACP contract details...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">Failed to load contract details</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      );
    }

    if (!contractState) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">No contract data available</h3>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'jobs', name: 'Jobs' },
                { id: 'job-details', name: 'Job Details' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'job-details' && renderJobDetails()}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-500/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-blue-600 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ACP Contract Dashboard</h1>
              <p className="text-gray-600">Manage jobs, memos, and platform settings for your ACP contract.</p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ACPContractDetailsPage; 