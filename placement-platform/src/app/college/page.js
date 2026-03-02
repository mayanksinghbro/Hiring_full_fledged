import { School, BarChart3, LineChart } from 'lucide-react';
import BatchAnalytics from '@/components/college/BatchAnalytics';
import CompanyMapping from '@/components/college/CompanyMapping';
import PlacementCharts from '@/components/college/PlacementCharts';

export default function CollegePortal() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8 fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <School className="h-6 w-6 text-violet-400" />
                    <h1 className="text-3xl font-bold gradient-text">College Placement Cell</h1>
                </div>
                <p className="text-slate-500 text-lg">Macro-level batch analytics and AI-powered company-student mapping</p>
            </div>

            {/* Batch Analytics - Now fetching real data from Neon! */}
            <BatchAnalytics />

            {/* Charts */}
            <div className="mt-8">
                <PlacementCharts />
            </div>

            {/* Company-Student Mapping */}
            <div className="mt-8">
                <CompanyMapping />
            </div>
        </div>
    );
}
