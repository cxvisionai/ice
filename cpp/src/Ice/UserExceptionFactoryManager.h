// **********************************************************************
//
// Copyright (c) 2002
// MutableRealms, Inc.
// Huntsville, AL, USA
//
// All Rights Reserved
//
// **********************************************************************

#ifndef ICE_USER_EXCEPTION_FACTORY_MANAGER_H
#define ICE_USER_EXCEPTION_FACTORY_MANAGER_H

#include <IceUtil/Shared.h>
#include <Ice/UserExceptionFactoryManagerF.h>
#include <Ice/UserExceptionFactoryF.h>

namespace IceInternal
{

class UserExceptionFactoryManager : public ::IceUtil::Shared, public JTCMutex
{
public:

    void add(const ::Ice::UserExceptionFactoryPtr&, const std::string&);
    void remove(const std::string&);
    ::Ice::UserExceptionFactoryPtr find(const std::string&);

private:

    UserExceptionFactoryManager();
    void destroy();
    friend class Instance;

    std::map<std::string, ::Ice::UserExceptionFactoryPtr> _factoryMap;
    std::map<std::string, ::Ice::UserExceptionFactoryPtr>::iterator _factoryMapHint;
};

}

#endif
