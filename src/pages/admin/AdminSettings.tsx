import { Settings, AlertTriangle, Database, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { useApp } from '../../lib/AppContext';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export function AdminSettings() {
  const { resetAllData, clearLocalStorage, deliverySettings, updateDeliverySettings } = useApp();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [dhakaCharge, setDhakaCharge] = useState(deliverySettings.dhakaCharge);
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState(deliverySettings.outsideDhakaCharge);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(deliverySettings.freeShippingThreshold);

  const handleSaveDeliverySettings = () => {
    updateDeliverySettings({
      dhakaCharge,
      outsideDhakaCharge,
      freeShippingThreshold,
    });
    toast.success('Delivery settings updated successfully!');
  };

  const handleResetAllData = () => {
    resetAllData();
    setShowResetDialog(false);
    // Refresh the page after a short delay to show the updated data
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleClearLocalStorage = () => {
    clearLocalStorage();
    setShowClearDialog(false);
    setTimeout(() => window.location.reload(), 1500);
  };
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Settings</h1>
        <p className="text-gray-600">Manage your store settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Update your store's basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="AURAZ" />
          </div>
          <div>
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input id="storeEmail" type="email" defaultValue="contact@auraz.com" />
          </div>
          <div>
            <Label htmlFor="storePhone">Store Phone</Label>
            <Input id="storePhone" defaultValue="+880 123 456 7890" />
          </div>
          <div>
            <Label htmlFor="storeAddress">Store Address</Label>
            <Input id="storeAddress" defaultValue="Dhaka, Bangladesh" />
          </div>
          <Button className="bg-[#591220] hover:bg-[#6d1728]">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Settings</CardTitle>
          <CardDescription>
            Configure delivery charges and options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dhakaCharge">Dhaka Delivery Charge (৳)</Label>
            <Input 
              id="dhakaCharge" 
              type="number" 
              value={dhakaCharge}
              onChange={(e) => setDhakaCharge(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="outsideDhakaCharge">Outside Dhaka Delivery Charge (৳)</Label>
            <Input 
              id="outsideDhakaCharge" 
              type="number" 
              value={outsideDhakaCharge}
              onChange={(e) => setOutsideDhakaCharge(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="freeShipping">Free Shipping Threshold (৳)</Label>
            <Input 
              id="freeShipping" 
              type="number" 
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
            />
          </div>
          <Button 
            className="bg-[#591220] hover:bg-[#6d1728]"
            onClick={handleSaveDeliverySettings}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Approval</CardTitle>
          <CardDescription>
            Control how new users are handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>Require manual approval for new users</p>
              <p className="text-sm text-gray-500">
                New user registrations will be pending until you approve them
              </p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
              Enabled
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p>Email notifications for new registrations</p>
              <p className="text-sm text-gray-500">
                Receive email when a new user registers
              </p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
              Enabled
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900">Data Management</CardTitle>
          </div>
          <CardDescription>
            Reset or clear application data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-orange-900 mb-1">Reset All Data to Defaults</p>
                <p className="text-sm text-orange-700 mb-3">
                  This will restore all products, carousel slides, vouchers, and promo cards to their default values. All users, orders, and other data will be cleared.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                  onClick={() => setShowResetDialog(true)}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">Clear Local Storage</p>
                <p className="text-sm text-gray-600 mb-3">
                  Clear all cached data from your browser. You'll need to refresh the page after this action.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowClearDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Storage
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <p className="mb-2 text-red-900">Clear all pending user requests</p>
            <p className="text-sm text-red-700 mb-3">
              This will reject all pending user registration requests
            </p>
            <Button variant="destructive" size="sm">
              Clear Pending Requests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Data Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all data to defaults including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All products (restored to mock data)</li>
                <li>Carousel slides</li>
                <li>Vouchers and promo cards</li>
                <li>All users will be deleted</li>
                <li>All orders will be deleted</li>
                <li>All reviews and notifications will be deleted</li>
              </ul>
              <p className="mt-3 font-semibold">This action cannot be undone!</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetAllData}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Yes, Reset All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Storage Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Local Storage?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all cached data from your browser. The page will reload automatically after clearing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearLocalStorage}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Yes, Clear Storage
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
