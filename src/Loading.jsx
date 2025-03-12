import React, { lazy, Suspense } from "react";
import Demo from "./page/admin/demo";

// Introduce an artificial delay of 1 minute (60,000 milliseconds)
const AdminPolicyList = lazy(() => 
  new Promise(resolve => 
    setTimeout(() => resolve(import("./page/admin/Admin_policy_list")), 60000)
  )
);


const LazyComponent = React.lazy(() => import("./page/agent/AgentDocumentUpload"));

function Loading() {
  return (
    <Suspense fallback={<Demo />}>
      <AdminPolicyList />
      <LazyComponent />
    </Suspense>
  );
}

export default Loading;
