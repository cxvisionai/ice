// **********************************************************************
//
// Copyright (c) 2001
// MutableRealms, Inc.
// Huntsville, AL, USA
//
// All Rights Reserved
//
// **********************************************************************

#ifndef ICE_PROPERTIES_ICE
#define ICE_PROPERTIES_ICE

#include <Ice/BuiltinSequences.ice>

module Ice
{

/**
 *
 * A property set to configure Ice and applications based on
 * Ice. Properties are key/value pairs, with both keys and values
 * being strings. By conventions, property keys should have the form
 * <replaceable>application-name</replaceable>\[.<replaceable>category</replaceable>\[.<replaceable>sub-category</replaceable>]].<replaceable>name</replaceable>.
 *
 **/
local interface Properties
{
    /**
     *
     * Get a property by key. If the property does not exist, an empty
     * string is returned.
     *
     * @param key The property key.
     *
     * @return The property value.
     *
     * @see setProperty
     *
     **/
    string getProperty(string key);

    /**
     *
     * Get a property by key. If the property does not exist, a
     * default value is returned.
     *
     * @param key The property key.
     *
     * @param value The supplied default value.
     *
     * @return The property value or the supplied default value.
     *
     * @see setProperty
     *
     **/
    string getPropertyWithDefault(string key, string value);

    /**
     *
     * Get a property as an integer. If the property is not set, 0 is
     * returned.
     *
     * @param key The property key.
     *
     * @return The property value interpreted as integer.
     *
     * @see setProperty
     *
     **/
    int getPropertyAsInt(string key);

    /**
     *
     * Get all properties whose keys begins with
     * <replaceable>prefix</replaceable>. If
     * <replaceable>prefix</replaceable> is an empty string,
     * then all properties are returned.
     *
     * @return The matching properties, in [key,value] pairs.
     *
     **/
    StringSeq getProperties(string prefix);

    /**
     *
     * Set a property.
     *
     * @param key The property key.
     * @param value The property value.
     *
     * @see getProperty
     *
     **/
    void setProperty(string key, string value);

    /**
     *
     * Get a sequence of command line options that is equivalent to
     * this property set.
     *
     * @return The command line options for this property set.
     *
     **/
    StringSeq getCommandLineOptions();

    /**
     *
     * Create a copy of this property set.
     *
     * @return A copy of this property set.
     *
     **/
    Properties clone();
};

};

#endif
