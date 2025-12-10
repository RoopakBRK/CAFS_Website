'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { CertificateAnalysisResponse } from '@/types';

export default function ValidationCertificatePage() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');
  
  let data: CertificateAnalysisResponse | null = null;
  
  if (dataParam) {
    try {
      // Decode from Base64
      const decodedString = atob(dataParam);
      data = JSON.parse(decodedString);
    } catch (error) {
      console.error('Error decoding certificate data:', error);
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No certificate data available</p>
      </div>
    );
  }

  const verificationDate = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const expiryDate = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data.extraction.issuer_url || 'https://skillkendra.com')}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SkillKendra Verification Certificate</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          .bg-pattern {
            background-color: #f8fafc;
            background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}} />
      </head>
      <body className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT SIDE: Verification Sidebar */}
          <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full h-full">
              
              {/* QR Code */}
              <div className="bg-white p-3 rounded-xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src={qrCodeUrl}
                  alt="Verification QR Code" 
                  className="w-40 h-40 object-contain"
                />
              </div>

              {/* Tagline */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 text-emerald-400 mb-2">
                  <i className="fas fa-check-circle text-xl"></i>
                  <span className="font-bold tracking-wide uppercase text-sm">Official Document</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-100 leading-tight">
                  Verified and Authenticated by <span className="text-blue-400">SkillKendra</span>
                </h2>
              </div>

              <div className="w-full border-t border-slate-700 mb-8"></div>

              {/* Verification Details */}
              <div className="w-full space-y-5 text-left text-sm">
                
                <div className="group">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Date of Verification</p>
                  <p className="font-medium text-slate-100 flex items-center">
                    <i className="far fa-calendar-check mr-2 text-blue-400"></i> {verificationDate}
                  </p>
                </div>

                <div className="group">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Expiry Date</p>
                  <p className="font-medium text-slate-100 flex items-center">
                    <i className="far fa-clock mr-2 text-orange-400"></i> {expiryDate}
                  </p>
                </div>

                {data.extraction.certificate_id && (
                  <div className="group">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">CFT ID</p>
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                      <p className="font-mono text-xs text-yellow-400 break-all select-all">
                        #{data.extraction.certificate_id}
                      </p>
                    </div>
                  </div>
                )}

                {data.extraction.issuer_url && (
                  <div className="group">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">CFT URL</p>
                    <a 
                      href={data.extraction.issuer_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center truncate"
                    >
                      <i className="fas fa-link mr-2 text-xs"></i> {data.extraction.issuer_url}
                    </a>
                  </div>
                )}

                {data.extraction.issuer_org && (
                  <div className="group">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Organization</p>
                    <p className="text-blue-400 flex items-center truncate">
                      <i className="fas fa-globe mr-2 text-xs"></i> {data.extraction.issuer_org}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-8 opacity-50">
                <p className="text-xs">Secure Verification System v2.0</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Certificate Context */}
          <div className="w-full md:w-2/3 bg-pattern p-8 md:p-12 flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Certificate of Verification</h1>
                <p className="text-slate-500">This document certifies that the credential has been verified and authenticated.</p>
              </div>
              <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-lg shadow-md font-bold text-2xl">
                SK
              </div>
            </div>

            <div className="space-y-6 mb-12">
              {data.extraction.candidate_name && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Issued To</label>
                  <p className="text-2xl font-serif text-slate-900">{data.extraction.candidate_name}</p>
                </div>
              )}
              
              {data.extraction.issuer_org && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Issuing Organization</label>
                  <p className="text-xl text-slate-700">{data.extraction.issuer_org}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Verification Status</label>
                <p className="text-lg text-slate-700">{data.verification.message}</p>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
              <p>
                Status: <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  {data.final_verdict}
                </span>
              </p>
              {data.extraction.certificate_id && (
                <p className="mt-2 sm:mt-0">ID: {data.extraction.certificate_id}</p>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
