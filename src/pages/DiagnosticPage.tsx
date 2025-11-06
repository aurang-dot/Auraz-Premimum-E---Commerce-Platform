import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertCircle, Database } from 'lucide-react';
import { useApp } from '../lib/AppContext';

export function DiagnosticPage() {
  const { products, users, orders } = useApp();
  const [tests, setTests] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: any[] = [];

    // Test 1: localStorage availability
    testResults.push({
      name: 'LocalStorage Check',
      status: typeof Storage !== 'undefined' ? 'success' : 'error',
      message: typeof Storage !== 'undefined' 
        ? 'LocalStorage is available'
        : 'LocalStorage is not available in this environment',
      details: typeof Storage !== 'undefined' ? 'Browser localStorage is working' : ''
    });
    setTests([...testResults]);

    // Test 2: App Context
    try {
      testResults.push({
        name: 'App Context Check',
        status: 'success',
        message: 'App context is initialized',
        details: `Products: ${products.length}, Users: ${users.length}, Orders: ${orders.length}`
      });
    } catch (error: any) {
      testResults.push({
        name: 'App Context Check',
        status: 'error',
        message: 'App context initialization failed',
        details: error.message
      });
    }
    setTests([...testResults]);

    // Test 3: Data in localStorage
    try {
      const hasProducts = localStorage.getItem('auraz_products') !== null;
      const hasUsers = localStorage.getItem('auraz_users') !== null;
      const hasOrders = localStorage.getItem('auraz_orders') !== null;
      
      testResults.push({
        name: 'LocalStorage Data Check',
        status: hasProducts || hasUsers || hasOrders ? 'success' : 'info',
        message: hasProducts || hasUsers || hasOrders 
          ? 'Data found in localStorage'
          : 'No data in localStorage (will use default data)',
        details: `Products: ${hasProducts ? 'Yes' : 'No'}, Users: ${hasUsers ? 'Yes' : 'No'}, Orders: ${hasOrders ? 'Yes' : 'No'}`
      });
    } catch (error: any) {
      testResults.push({
        name: 'LocalStorage Data Check',
        status: 'error',
        message: 'Error checking localStorage data',
        details: error.message
      });
    }
    setTests([...testResults]);

    // Test 4: Storage Quota
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const usedMB = (used / 1024 / 1024).toFixed(2);
        const quotaMB = (quota / 1024 / 1024).toFixed(2);
        const percentage = ((used / quota) * 100).toFixed(2);
        
        testResults.push({
          name: 'Storage Quota Check',
          status: parseFloat(percentage) < 80 ? 'success' : 'info',
          message: `Storage: ${usedMB} MB / ${quotaMB} MB (${percentage}%)`,
          details: parseFloat(percentage) < 80 
            ? 'Storage usage is healthy'
            : 'Storage usage is high, consider clearing old data'
        });
      } else {
        testResults.push({
          name: 'Storage Quota Check',
          status: 'info',
          message: 'Storage quota API not available',
          details: 'Browser does not support storage quota API'
        });
      }
    } catch (error: any) {
      testResults.push({
        name: 'Storage Quota Check',
        status: 'error',
        message: 'Error checking storage quota',
        details: error.message
      });
    }
    setTests([...testResults]);

    // Test 5: Browser Compatibility
    const isModernBrowser = 
      typeof window !== 'undefined' &&
      'localStorage' in window &&
      'JSON' in window &&
      'fetch' in window;
    
    testResults.push({
      name: 'Browser Compatibility',
      status: isModernBrowser ? 'success' : 'error',
      message: isModernBrowser 
        ? 'Browser supports all required features'
        : 'Browser may not support all required features',
      details: isModernBrowser 
        ? 'localStorage, JSON, and fetch APIs are available'
        : 'Some APIs may not be available'
    });
    setTests([...testResults]);

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'error') return <XCircle className="h-5 w-5 text-red-600" />;
    if (status === 'info') return <AlertCircle className="h-5 w-5 text-blue-600" />;
    return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'bg-green-100 border-green-300';
    if (status === 'error') return 'bg-red-100 border-red-300';
    if (status === 'info') return 'bg-blue-100 border-blue-300';
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">🔍 AURAZ Diagnostic Tool</h1>
          <p className="text-gray-600">Testing application setup and functionality</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>System Tests</CardTitle>
            <CardDescription>
              Running comprehensive tests on your application setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(test.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(test.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{test.name}</h3>
                        <Badge
                          className={
                            test.status === 'success'
                              ? 'bg-green-600'
                              : test.status === 'error'
                              ? 'bg-red-600'
                              : 'bg-blue-600'
                          }
                        >
                          {test.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{test.message}</p>
                      {test.details && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-700 font-medium mb-1">
                            Show Details
                          </summary>
                          <pre className="bg-white p-2 rounded border overflow-auto max-h-40">
                            {test.details}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isRunning && (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600 mt-2">Running tests...</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={runTests}
                disabled={isRunning}
                className="bg-[#591220] hover:bg-[#591220]/90"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Tests Again'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 About This Application</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-3">
            <div>
              <strong>Storage:</strong> This application uses browser localStorage to store data.
              All data is stored locally in your browser and persists across sessions.
            </div>
            <div>
              <strong>Data Persistence:</strong> Your products, users, orders, and other data are saved
              automatically to localStorage whenever changes are made.
            </div>
            <div>
              <strong>Deployment:</strong> This application is ready to deploy to Vercel. 
              All data will be stored in the browser's localStorage for each user.
            </div>
            <div>
              <strong>Future Database:</strong> If you need server-side data storage, you can integrate
              Vercel Postgres or another database service later.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
