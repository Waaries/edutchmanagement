
import React from 'react';

interface DebugInfoDisplayProps {
  debugInfo: any;
}

const DebugInfoDisplay: React.FC<DebugInfoDisplayProps> = ({ debugInfo }) => {
  if (!debugInfo) return null;

  return (
    <div className="mt-3 text-xs bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">
      <div><strong>Environment:</strong> {debugInfo.environment}</div>
      <div><strong>Hostname:</strong> {debugInfo.hostname}</div>
      <div><strong>gtag exists:</strong> {debugInfo.gtagExists ? '✅' : '❌'}</div>
      <div><strong>gtag ready:</strong> {debugInfo.gtagReady ? '✅' : '❌'}</div>
      <div><strong>Has consent:</strong> {debugInfo.hasConsent ? '✅' : '❌'}</div>
      <div><strong>Consent status:</strong> {debugInfo.consentStatus || 'null'}</div>
      <div><strong>Should track:</strong> {debugInfo.shouldTrack ? '✅' : '❌'}</div>
      <div><strong>Should track (RT):</strong> {debugInfo.shouldTrackRealtime ? '✅' : '❌'}</div>
      <div><strong>Measurement ID:</strong> {debugInfo.measurementId}</div>
      
      {debugInfo.cookies && (
        <div className="mt-2 border-t pt-2">
          <strong>Cookie Details:</strong>
          <div className="ml-2">
            <div><strong>Consent:</strong> {debugInfo.cookies.consentCookie || 'not set'}</div>
            <div><strong>Analytics:</strong> {debugInfo.cookies.analyticsEnabledCookie || 'not set'}</div>
            <div><strong>Timestamp:</strong> {debugInfo.cookies.timestampCookie || 'not set'}</div>
            <div><strong>Raw:</strong> {debugInfo.cookies.rawCookies || 'empty'}</div>
          </div>
        </div>
      )}
      
      {debugInfo.debugLog && debugInfo.debugLog.length > 0 && (
        <div className="mt-2 border-t pt-2">
          <strong>Recent logs:</strong>
          <div className="max-h-20 overflow-y-auto text-xs">
            {debugInfo.debugLog.slice(-3).map((log: any, index: number) => (
              <div key={index} className="border-t pt-1 mt-1">
                <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {debugInfo.timestamp && (
        <div className="mt-2 text-gray-400 text-xs">
          Last updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default DebugInfoDisplay;
